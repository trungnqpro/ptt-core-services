const JWT = require('jsonwebtoken')
const Redis = require('../../connections/redis')
const { utils, errors, Debug } = require('../../libs')
const HtmlTemplate = require('./html-template')
const { User } = require('../../resources')
const debug = Debug()
const ROLE_STUDENT_ID = process.env.ROLE_STUDENT_ID
const WEB_BASE_URL = process.env.WEB_BASE_URL
const {
    NotFoundError,
    DataError,
    ForbiddenError,
    PermissionError,
    AuthenticationError,
    ValidationError,
    ConflictError,
} = errors

const studentRoleId = process.env.ROLE_STUDENT_ID

exports.login = async ctx => {
    const { username, password } = ctx.request.body

    let profile = await User.Service.getProfileByIdentity(username)

    if (!profile) {
        throw new ValidationError('User name is not existed')
    }

    if (profile.status !== User.Static.STATUS.ACTIVE) {
        throw new PermissionError('User is not active')
    }

    const user = profile

    profile = {
        id: profile._id,
        roleId: profile.roleId?._id,
        firstName: profile.firstName,
        lastName: profile.lastName,
        avatarUrl: profile.avatarUrl,
        intro: profile.intro,
        loggedAt: new Date().getTime(),
    }

    ctx.body = {
        accessToken: generateAccessToken(profile),
        refreshToken: generateRefreshToken(profile),
        isStudent: profile.roleId?._id.toString() === studentRoleId,
        profile,
        // permissions,
    }
}

exports.signup = async ctx => {
    const fields = ctx.request.body
    const [usersByUsername, usersByEmail] = await Promise.all([
        User.Service.getByUsernameOrEmail(fields.username),
        User.Service.getByUsernameOrEmail(fields.email),
    ])

    if (usersByUsername.length) {
        throw new ValidationError('Username is existed')
    }

    if (usersByEmail.length) {
        throw new ValidationError('Email is existed')
    }

    fields.status = 'pending'
    fields.roleId = ROLE_STUDENT_ID
    fields.firstName = fields.fullName
    const user = await User.Service.create(fields)

    utils
        .sendMail(
            user.email,
            'Verify Your Email Address - SAPP',
            null,
            HtmlTemplate.verifyEmail(user.email, user.firstName || ''),
        )
        .then(result => {
            debug.log(result)
        })
        .catch(error => {
            debug.error(error)
        })

    ctx.body = User.Helper.protect(user)
}

exports.verifyEmail = async ctx => {
    function sendError() {
        ctx.status = 302
        ctx.redirect(`${WEB_BASE_URL}/auth/register`)
        //ctx.body = "fail"
    }

    function sendSuccess() {
        ctx.status = 302
        ctx.redirect(`${WEB_BASE_URL}/auth/verify-email`)
        //ctx.body = 'success'
    }

    const { verifyToken } = ctx.query || {}

    if (!verifyToken) {
        return sendError()
    }

    let payload

    try {
        payload = JWT.verify(verifyToken, process.env.JWT_SECRET_KEY)
    } catch (e) {
        return sendError()
    }

    const user = await User.Service.getByUsernameOrEmail(payload.email)

    if (user.length !== 1) {
        return sendError()
    }

    if (user[0].status !== User.Static.STATUS.PENDING) {
        return sendError()
    }

    await User.Service.updateById(user[0]._id, {
        status: User.Static.STATUS.ACTIVE,
    })

    return sendSuccess()
}

exports.resendVerifyingEmail = async ctx => {
    const { email } = ctx.query || {}

    const users = await User.Service.getByUsernameOrEmail(email)

    if (!users.length) {
        throw new NotFoundError('Email is not registered')
    }

    const user = users[0]

    if (user.status === User.Static.STATUS.ACTIVE) {
        throw new ConflictError('Email has been active')
    }

    if (user.status !== User.Static.STATUS.PENDING) {
        throw new NotFoundError('Cannot use this email. Please contact administrator.')
    }

    utils
        .sendMail(
            email,
            'Verify Your Email Address - SAPP LMS',
            null,
            HtmlTemplate.verifyEmail(email, user.firstName || ''),
        )
        .then(result => {
            console.log(result)
        })
        .catch(error => {
            console.error(error)
        })

    ctx.body = 'success'
}

exports.getAccessToken = async ctx => {
    const { refreshToken } = ctx.query

    let payload
    try {
        payload = JWT.verify(refreshToken, process.env.JWT_SECRET_KEY)
    } catch (error) {
        throw new AuthenticationError(error.message)
    }

    ctx.body = {
        accessToken: generateAccessToken({ ...payload }),
    }
}

exports.forgotPassword = async ctx => {
    const { email, callbackUrl } = ctx.query

    const users = await User.Service.getByUsernameOrEmail(email)

    if (!users.length) {
        throw new NotFoundError('Email is not registered')
    }

    if (users.length > 1) {
        throw new DataError(
            `There are more than one user has email ${email}. Please contact admin.`,
        )
    }

    utils
        .sendMail(
            email,
            'Đặt lại mật khẩu - SAPP LMS',
            null,
            HtmlTemplate.resetPassword(email, callbackUrl),
        )
        .then(result => {
            console.log(result)
        })
        .catch(error => {
            console.error(error)
        })

    ctx.body = 'success'
}

exports.setPassword = async ctx => {
    const { password, token } = ctx.request.body

    let payload

    try {
        payload = JWT.verify(token, process.env.JWT_SECRET_KEY)
    } catch (e) {
        throw new ValidationError('Token is invalid/expired')
    }

    const users = await User.Service.getByUsernameOrEmail(payload.email)

    if (!users.length) {
        throw new NotFoundError('Email is not registered')
    }

    if (users.length > 1) {
        throw new DataError(
            `There are more than one user has email ${payload.email}. Please contact admin.`,
        )
    }

    await User.Service.updatePasswordById(users[0]._id, password)

    ctx.body = 'success'
}

function generateAccessToken(user) {
    return JWT.sign(
        {
            type: 'at',
            id: user.id,
            roleId: user.roleId,
            firstName: user.firstName,
            lastName: user.lastName,
            avatarUrl: user.avatarUrl,
            deviceId: user.deviceId,
            loggedAt: user.loggedAt,
        },
        process.env.JWT_SECRET_KEY,
        {
            expiresIn: process.env.ACCESS_TOKEN_TTL,
        },
    )
}

function generateRefreshToken(user) {
    return JWT.sign(
        {
            type: 'rt',
            id: user.id,
            roleId: user.roleId,
            firstName: user.firstName,
            lastName: user.lastName,
            avatarUrl: user.avatarUrl,
            deviceId: user.deviceId,
            loggedAt: user.loggedAt,
        },
        process.env.JWT_SECRET_KEY,
        {
            expiresIn: process.env.REFRESH_TOKEN_TTL,
        },
    )
}

function preventLoginMultiDevices(userId, devices) {
    devices.sort((a, b) => (a.lastLoggedIn > b.lastLoggedIn ? -1 : 1)) // desc

    const ableDevices = devices.splice(0, 2) // keep 2 newest devices
    const kickedDevices = devices
    if (kickedDevices.length) {
        Redis.getPublisher()
            .publish(
                'kick-of-devices',
                JSON.stringify({ userId, deviceIds: kickedDevices.map(e => e.deviceId) }),
            )
            .catch(err => debug.error(err))
    }
}

const moment = require('moment')
const { CITY, UNIVERSITY } = require('./static')

exports.protect = user => {
    if (!user || typeof user !== 'object') {
        return user
    }

    const protectedUser = { ...user }
    protectedUser.id = user._id

    delete protectedUser._id
    delete protectedUser.password
    delete protectedUser.hashPassword
    delete protectedUser.__v
    if (protectedUser.birthday) {
        protectedUser.birthday = moment(protectedUser.birthday).format('YYYY-MM-DD')
    }

    return protectedUser
}

exports.getShortProfile = user => {
    if (!user || typeof user !== 'object') {
        return user
    }

    return {
        id: user._id,
        code: user.code,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatarUrl: user.avatarUrl,
        phoneNumber: user.phoneNumber,
    }
}

exports.getShortProfileWithTimeStudy = user => {
    if (!user || typeof user !== 'object') {
        return user
    }

    return {
        id: user._id,
        code: user.code,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatarUrl: user.avatarUrl,
        phoneNumber: user.phoneNumber,
        timeStudy: user.timeStudy,
    }
}

exports.getFullProfile = user => {
    if (!user || typeof user !== 'object') {
        return user
    }

    return {
        id: user._id,
        code: user.code,
        username: user.username,
        email: user.email,
        avatarUrl: user.avatarUrl,
        firstName: user.firstName,
        lastName: user.lastName,
        fullAddress: user.fullAddress,
        phoneNumber: user.phoneNumber,
        intro: user.intro,
        birthday: user.birthday ? moment(user.birthday).format('YYYY-MM-DD') : undefined,
        status: user.status,
        gender: user.gender,
    }
}

exports.getProfileAndPassword = user => {
    if (!user || typeof user !== 'object') {
        return user
    }

    return {
        id: user._id,
        code: user.code,
        username: user.username,
        email: user.email,
        avatarUrl: user.avatarUrl,
        firstName: user.firstName,
        lastName: user.lastName,
        fullAddress: user.fullAddress,
        phoneNumber: user.phoneNumber,
        intro: user.intro,
        birthday: user.birthday ? moment(user.birthday).format('YYYY-MM-DD') : undefined,
        password: user.password,
        createdAt: user.createdAt,
    }
}

exports.getUsername = user => {
    if (!user || typeof user !== 'object') {
        return user
    }

    return {
        email: user.email,
    }
}

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value)
}

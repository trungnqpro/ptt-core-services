const { utils, errors } = require('../../libs')
const { User } = require('../../resources')
const { DELETED } = User.Static.STATUS

const { NotFoundError } = errors

exports.fetch = async ctx => {
    const { status, roleId, gender, q } = ctx.query
    const limit = parseInt(ctx.query.limit || '20')
    const skipPage = parseInt(ctx.query.skipPage || '0')
    const skip = parseInt(skipPage || '0') * limit
    const sort = utils.getSortFromQuery(ctx.query)

    const filter = {}
    if (status) {
        filter.status = status
    } else {
        filter.status = { $ne: DELETED }
    }
    if (gender) {
        filter.gender = gender
    }
    if (roleId) {
        filter.roleId = roleId
    }
    if (q) {
        filter.q = q
    }

    if (ctx.routerPath === '/users/teachers') {
        filter.roleId = process.env.ROLE_TEACHER_ID
    } else if (ctx.routerPath === '/users/supporters') {
        filter.roleId = { $in: [process.env.ROLE_RD_SUPPORT_ID, process.env.ROLE_CX_SUPPORT_ID] }
    }

    const { users = [], total } = await User.Service.fetch(skip, limit, filter, sort)

    ctx.body = users.map(User.Helper.protect)
    ctx.state.paging = utils.generatePaging(skipPage, limit, total)
}

exports.create = async ctx => {
    const fields = ctx.request.body
    const user = await User.Service.create({
        ...fields,
        status: User.Static.STATUS.ACTIVE,
    })

    ctx.body = User.Helper.protect(user)
}

exports.get = async ctx => {
    const { id } = ctx.params
    const user = await User.Service.getById(id)

    if (!user) {
        throw new NotFoundError(`Not found user by id ${id}`)
    }

    ctx.body = User.Helper.protect(user)
}

exports.update = async ctx => {
    const { id } = ctx.params
    const updatedFields = ctx.request.body
    const user = await User.Service.updateById(id, updatedFields)

    ctx.body = User.Helper.protect(user)
}

exports.delete = async ctx => {
    const { id } = ctx.params
    await User.Service.deleteById(id)

    ctx.body = 'success'
}

exports.resetPassword = async ctx => {
    const { id } = ctx.params
    const { value: password } = ctx.request.body

    const user = await User.Service.updatePasswordById(id, password)
    if (!user) {
        throw new NotFoundError(`User id ${id} is not found`)
    }

    ctx.body = 'success'
}

exports.updateMyProfile = async ctx => {
    const { id } = ctx.state.user || {}
    const updatedFields = ctx.request.body
    const user = await User.Service.updateById(id, updatedFields)

    ctx.body = User.Helper.protect(user)
}

exports.getMyProfile = async ctx => {
    const { id } = ctx.state.user
    const user = await User.Service.getById(id)

    ctx.body = User.Helper.protect(user)
}

exports.setMyPassword = async ctx => {
    const { id } = ctx.state.user
    const { currentPassword, value: newPassword } = ctx.request.body

    const user = await User.Service.setMyPassword(id, newPassword, currentPassword)

    if (!user || user.status === DELETED) {
        throw new NotFoundError(`Not found user by id ${id}`)
    }

    ctx.body = 'success'
}

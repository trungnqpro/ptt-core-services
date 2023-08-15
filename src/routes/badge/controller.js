const { utils, errors } = require('../../libs')
const { Badge } = require('../../resources')
const { DELETED } = Badge.Static.STATUS

const { NotFoundError } = errors

exports.fetch = async ctx => {
    const { status, q } = ctx.query
    const limit = parseInt(ctx.query.limit || '20')
    const skipPage = parseInt(ctx.query.skipPage || '0')
    const skip = parseInt(skipPage || '0') * limit
    const sort = utils.getSortFromQuery(ctx.query)

    const filter = {}
    if (status) {
        filter.status = status
    }
    if (q) {
        filter.q = q
    }

    const { badges = [], total } = await Badge.Service.fetch(skip, limit, filter, sort)

    ctx.body = badges.map(Badge.Helper.formatList)
    ctx.state.paging = utils.generatePaging(skipPage, limit, total)
}

exports.create = async ctx => {
    const fields = ctx.request.body
    const user = await Badge.Service.create({
        ...fields,
        status: Badge.Static.STATUS.ACTIVE,
    })

    ctx.body = Badge.Helper.protect(user)
}

exports.get = async ctx => {
    const { id } = ctx.params
    const user = await Badge.Service.getById(id)

    if (!user) {
        throw new NotFoundError(`Not found user by id ${id}`)
    }

    ctx.body = Badge.Helper.protect(user)
}

exports.update = async ctx => {
    const { id } = ctx.params
    const updatedFields = ctx.request.body
    const user = await Badge.Service.updateById(id, updatedFields)

    ctx.body = Badge.Helper.protect(user)
}

exports.delete = async ctx => {
    const { id } = ctx.params
    await Badge.Service.deleteById(id)

    ctx.body = 'success'
}

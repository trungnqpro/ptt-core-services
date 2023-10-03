const { utils, errors } = require('../../libs')
const { Badge } = require('../../resources')

const { NotFoundError } = errors

exports.fetch = async ctx => {
    const { q } = ctx.query
    const limit = parseInt(ctx.query.limit || '20')
    const skipPage = parseInt(ctx.query.skipPage || '0')
    const skip = skipPage * limit
    const sort = utils.getSortFromQuery(ctx.query)

    const filter = {}
    if (q) {
        filter.q = q
    }

    const { badges = [], total } = await Badge.Service.fetch(skip, limit, filter, sort)

    ctx.body = badges.map(Badge.Helper.formatList)
    ctx.state.paging = utils.generatePaging(skipPage, limit, total)
}

exports.create = async ctx => {
    const fields = ctx.request.body
    const record = await Badge.Service.create({
        ...fields,
        createdBy: ctx.state?.user?.id,
    })

    ctx.body = Badge.Helper.protect(record)
}

exports.get = async ctx => {
    const { id } = ctx.params
    const record = await Badge.Service.getById(id)

    if (!record) {
        throw new NotFoundError(`Not found record by id ${id}`)
    }

    ctx.body = Badge.Helper.protect(record)
}

exports.update = async ctx => {
    const { id } = ctx.params
    const updatedFields = ctx.request.body
    const record = await Badge.Service.updateById(id, {
        ...updatedFields,
        createdBy: ctx.state?.user?.id,
    })

    ctx.body = Badge.Helper.protect(record)
}

exports.delete = async ctx => {
    const { id } = ctx.params
    await Badge.Service.deleteById(id)

    ctx.body = 'success'
}

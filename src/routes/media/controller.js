const { utils, errors } = require('../../libs')
const { Media } = require('../../resources')

const { NotFoundError } = errors

exports.fetch = async ctx => {
    const { q } = ctx.query
    const limit = parseInt(ctx.query.limit || '20')
    const skipPage = parseInt(ctx.query.skipPage || '0')
    const skip = parseInt(skipPage || '0') * limit
    const sort = utils.getSortFromQuery(ctx.query)

    const filter = {}
    if (q) {
        filter.q = q
    }

    const { medias = [], total } = await Media.Service.fetch(skip, limit, filter, sort)

    ctx.body = medias.map(Media.Helper.formatList)
    ctx.state.paging = utils.generatePaging(skipPage, limit, total)
}

exports.create = async ctx => {
    const fields = ctx.request.body
    const record = await Media.Service.create({
        ...fields,
    })

    ctx.body = Media.Helper.protect(record)
}

exports.get = async ctx => {
    const { id } = ctx.params
    const record = await Media.Service.getById(id)

    if (!record) {
        throw new NotFoundError(`Not found record by id ${id}`)
    }

    ctx.body = Media.Helper.protect(record)
}

exports.update = async ctx => {
    const { id } = ctx.params
    const updatedFields = ctx.request.body
    const record = await Media.Service.updateById(id, updatedFields)

    ctx.body = Media.Helper.protect(record)
}

exports.delete = async ctx => {
    const { id } = ctx.params
    await Media.Service.deleteById(id)

    ctx.body = 'success'
}
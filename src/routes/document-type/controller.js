const { utils, errors } = require('../../libs')
const { DocumentType } = require('../../resources')

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

    const { departments = [], total } = await DocumentType.Service.fetch(skip, limit, filter, sort)

    ctx.body = departments.map(DocumentType.Helper.formatList)
    ctx.state.paging = utils.generatePaging(skipPage, limit, total)
}

exports.create = async ctx => {
    const fields = ctx.request.body
    const record = await DocumentType.Service.create({
        ...fields,
    })

    ctx.body = DocumentType.Helper.protect(record)
}

exports.get = async ctx => {
    const { id } = ctx.params
    const record = await DocumentType.Service.getById(id)

    if (!record) {
        throw new NotFoundError(`Not found record by id ${id}`)
    }

    ctx.body = DocumentType.Helper.protect(record)
}

exports.update = async ctx => {
    const { id } = ctx.params
    const updatedFields = ctx.request.body
    const record = await DocumentType.Service.updateById(id, updatedFields)

    ctx.body = DocumentType.Helper.protect(record)
}

exports.delete = async ctx => {
    const { id } = ctx.params
    await DocumentType.Service.deleteById(id)

    ctx.body = 'success'
}

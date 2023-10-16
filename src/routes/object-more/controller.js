const { utils, errors } = require('../../libs')
const { ObjectMore } = require('../../resources')

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

    const { mores = [], total } = await ObjectMore.Service.fetch(skip, limit, filter, sort)

    ctx.body = mores.map(ObjectMore.Helper.formatList)
    ctx.state.paging = utils.generatePaging(skipPage, limit, total)
}

exports.create = async ctx => {
    const fields = ctx.request.body
    const record = await ObjectMore.Service.create({
        ...fields,
        createdBy: ctx.state?.user?.id,
    })

    ctx.body = ObjectMore.Helper.protect(record)
}

exports.get = async ctx => {
    const { id } = ctx.params
    const record = await ObjectMore.Service.getById(id)

    if (!record) {
        throw new NotFoundError(`Not found record by id ${id}`)
    }

    ctx.body = ObjectMore.Helper.protect(record)
}

exports.fetchBySourceId = async ctx => {
    const { id } = ctx.params
    const { mores = [] } = await ObjectMore.Service.getBySourceId(id)

    ctx.body = mores.map(ObjectMore.Helper.formatList)
}

exports.update = async ctx => {
    const { id } = ctx.params
    const updatedFields = ctx.request.body
    const record = await ObjectMore.Service.updateById(id, {
        ...updatedFields,
        updatedBy: ctx.state?.user?.id,
    })

    ctx.body = ObjectMore.Helper.protect(record)
}

exports.delete = async ctx => {
    const { id } = ctx.params
    await ObjectMore.Service.deleteById(id)

    ctx.body = 'success'
}

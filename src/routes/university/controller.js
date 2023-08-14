const { University } = require('../../resources')
const { NotFoundError } = require('../../libs/errors')

exports.fetch = async ctx => {
    const { curriculumId } = ctx.params
    const filter = {
        curriculumId,
    }
    const universities = await University.Model.fetch(filter)

    ctx.body = universities.map(University.Helper.formatList)
}

exports.create = async ctx => {
    const fields = ctx.request.body
    fields.createById = ctx.state.user.id
    const { curriculumId } = ctx.params
    fields.curriculumId = curriculumId
    const university = await University.Model.create(fields)

    ctx.body = University.Helper.format(university)
}

exports.update = async ctx => {
    const { id } = ctx.params
    const { curriculumId } = ctx.params

    const updatedFields = ctx.request.body
    const university = await University.Model.updateById(id, updatedFields)

    if (!university) {
        throw new NotFoundError(`University id ${id} not found`)
    }

    ctx.body = University.Helper.format(university)
}

exports.delete = async ctx => {
    const { curriculumId } = ctx.params
    const { id } = ctx.params

    await University.Model.deleteById(id)

    ctx.body = 'success'
}

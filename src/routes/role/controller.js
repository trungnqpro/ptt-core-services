const { errors } = require('../../libs')
const { Role } = require('../../resources')

const { NotFoundError } = errors

exports.fetch = async ctx => {
    const { onlyMember } = ctx.query

    let roles = await Role.Service.fetch()
    roles = roles.map(Role.Helper.format)
    if (onlyMember) {
        roles = roles.filter(role => role.id.toString() !== process.env.ROLE_STUDENT_ID)
    }

    ctx.body = roles || []
}

exports.create = async ctx => {
    const fields = ctx.request.body
    const role = await Role.Service.create({
        ...fields,
        updatedBy: ctx.state.user.id,
    })

    ctx.body = Role.Helper.format(role)
}

exports.get = async ctx => {
    const { id } = ctx.params
    const role = await Role.Service.getById(id)

    if (!role) {
        throw new NotFoundError(`Not found role by id ${id}`)
    }

    ctx.body = Role.Helper.format(role)
}

exports.update = async ctx => {
    const { id } = ctx.params
    const updatedFields = ctx.request.body
    const role = await Role.Service.updateById(id, {
        ...updatedFields,
        updatedBy: ctx.state.user.id,
    })

    ctx.body = Role.Helper.format(role)
}

exports.delete = async ctx => {
    const { id } = ctx.params

    await Role.Service.deleteById(id)

    ctx.body = 'success'
}

const Email = require('../../resources/email')
const { NotFoundError } = require('../../libs/errors')

exports.fetch = async ctx => {
    const email = await Email.Model.fetch()

    ctx.body = email.map(Email.Helper.format)
}

exports.create = async ctx => {
    const fields = ctx.request.body

    const email = await Email.Model.create(fields)

    ctx.body = Email.Helper.format(email)
}

exports.getById = async ctx => {
    const fields = ctx.request.body

    const email = await Email.Model.getById(fields)

    ctx.body = Email.Helper.format(email)
}

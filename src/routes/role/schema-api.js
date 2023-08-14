const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

const updateBody = Joi.object({
    name: Joi.string().max(256),
    permissions: Joi.array().items(Joi.string()),
})

exports.post = {
    body: updateBody,
}

exports.get = {
    query: Joi.object({
        onlyMember: Joi.number().valid(1),
    }),
}

exports.idGet = {
    params: Joi.object({
        id: Joi.objectId().required(),
    }),
}

exports.idPut = {
    body: updateBody,
    params: Joi.object({
        id: Joi.objectId().required(),
    }),
}

exports.idDelete = {
    params: Joi.object({
        id: Joi.objectId().required(),
    }),
}

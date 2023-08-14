const Joi = require('joi').extend(require('@joi/date'))
Joi.objectId = require('joi-objectid')(Joi)

const model = {
    name: Joi.string(),
}

exports.post = {
    body: Joi.object({
        name: model.name.required(),
    }),
}

exports.idGet = {
    params: Joi.object({
        id: Joi.objectId().required(),
    }),
}

exports.idPut = {
    body: Joi.object({
        name: model.name,
    }),
    params: Joi.object({
        id: Joi.objectId().required(),
    }),
}

exports.idDelete = {
    params: Joi.object({
        id: Joi.objectId().required(),
    }),
}

const Joi = require('joi').extend(require('@joi/date'))
Joi.objectId = require('joi-objectid')(Joi)

const { TYPE } = require('../../resources/email/static')
const types = Object.values(TYPE)

const model = {
    type: Joi.string()
        .valid(...types)
        .required(),
    description: Joi.string().required(),
    title: Joi.string(),
    emailDeliveryTime: Joi.number(),
}

exports.post = {
    body: Joi.object({
        description: model.description,
        title: model.title,
        type: model.type,
        emailDeliveryTime: model.emailDeliveryTime,
    }),
}

exports.idGet = {
    params: Joi.object({
        id: Joi.objectId().required(),
    }),
}

exports.idPut = {
    body: Joi.object({
        type: model.type,
        description: model.description,
        title: model.title,
        emailDeliveryTime: model.emailDeliveryTime,
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

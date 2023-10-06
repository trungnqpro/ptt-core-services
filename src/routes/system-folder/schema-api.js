const Joi = require('joi').extend(require('@joi/date'))
Joi.objectId = require('joi-objectid')(Joi)

const model = {
    name: Joi.string().max(256),
    parentId: Joi.string(),
    description: Joi.string().max(1000),
}

const updateBody = Joi.object({
    name: Joi.string().max(256),
    description: Joi.string().max(1000),
})

const post = {
    body: Joi.object({
        name: model.name.required(),
        parentId: model.parentId,
        description: model.description,
    }),
}

const get = {
    query: Joi.object({
        skipPage: Joi.number(),
        limit: Joi.number().max(9999),
        q: Joi.string(),
    }),
}

const idGet = {
    params: Joi.object({
        id: Joi.objectId().required(),
    }),
}

const idPut = {
    body: updateBody,
    params: Joi.object({
        id: Joi.objectId().required(),
    }),
}

const idDelete = {
    params: Joi.object({
        id: Joi.objectId().required(),
    }),
}

module.exports = {
    post,
    get,
    idGet,
    idPut,
    idDelete,
}

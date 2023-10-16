const Joi = require('joi').extend(require('@joi/date'))
Joi.objectId = require('joi-objectid')(Joi)

const model = {
    sourceId: Joi.string(),
    urls: Joi.array().items(Joi.string()),
}

const updateBody = Joi.object({
    sourceId: Joi.string(),
})

const post = {
    body: Joi.object({
        sourceId: model.sourceId.required(),
        urls: model.urls.required(),
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

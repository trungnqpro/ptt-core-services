const Joi = require('joi').extend(require('@joi/date'))
Joi.objectId = require('joi-objectid')(Joi)

const model = {
    name: Joi.string().max(1000),
    caption: Joi.string().max(1000),
    departmentId: Joi.objectId(),
    positionId: Joi.objectId(),
    badgeId: Joi.objectId(),
    folderId: Joi.objectId(),
    periodStart: Joi.date(),
    periodEnd: Joi.date(),
    orderNum: Joi.number(),
    transcript: Joi.string().optional().allow('').max(10000),
    videoUrl: Joi.string().optional().allow(''),
    imageUrl: Joi.string().optional().allow(''),
    audioUrl: Joi.string().optional().allow(''),
    moreUrls: Joi.array().items(Joi.string()),
}

const updateBody = Joi.object({
    name: model.name,
    caption: model.caption,
    departmentId: model.departmentId,
    positionId: model.positionId,
    badgeId: model.badgeId,
    folderId: model.folderId,
    periodStart: model.periodStart,
    periodEnd: model.name,
    orderNum: model.orderNum,
    transcript: model.transcript,
    videoUrl: model.videoUrl,
    imageUrl: model.imageUrl,
    audioUrl: model.audioUrl,
    moreUrls: model.moreUrls,
})

const post = {
    body: Joi.object({
        name: model.name.required(),
        departmentId: model.departmentId.required(),
        positionId: model.positionId.required(),
        badgeId: model.badgeId.required(),
        folderId: model.folderId.required(),
        periodStart: model.periodStart,
        periodEnd: model.name,
        caption: model.caption,
        orderNum: model.orderNum,
        transcript: model.transcript,
        imageUrl: model.imageUrl.required(),
        videoUrl: model.videoUrl,
        audioUrl: model.audioUrl,
        moreUrls: model.moreUrls,
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

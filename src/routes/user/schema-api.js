const Joi = require('joi').extend(require('@joi/date'))
Joi.objectId = require('joi-objectid')(Joi)
const { mediaUrl } = require('../../libs/utils')

const { STATUS, GENDER, MAJOR, UNIVERSITY } = require('../../resources').User.Static

const statuses = Object.values(STATUS)
const arrGender = Object.values(GENDER)
const regexUsername = /[a-zA-Z0-9-_.]/
const regexPassword = /[a-zA-Z0-9#?!@$%^&*-]/

const model = {
    email: Joi.string().email().max(500),
    username: Joi.string().regex(regexUsername).min(3).max(60),
    password: Joi.string().regex(regexPassword).min(6).max(256),
    firstName: Joi.string().max(256),
    lastName: Joi.string().max(256),
    gender: Joi.string().valid(...arrGender),
    phoneNumber: Joi.string().max(256),
    avatarUrl: Joi.string().regex(mediaUrl),
    fullAddress: Joi.string().max(500),
    birthday: Joi.date().format('YYYY-MM-DD'),
    imgBackIdentityCardUrl: Joi.string().regex(mediaUrl),
    roleId: Joi.objectId(),
    status: Joi.string().valid(...statuses),
}

const updateBody = Joi.object({
    firstName: model.firstName,
    lastName: model.lastName,
    gender: model.gender,
    email: model.email,
    phoneNumber: model.phoneNumber,
    avatarUrl: model.avatarUrl,
    fullAddress: model.fullAddress,
    birthday: model.birthday,
    roleId: model.roleId,
    status: model.status,
})

const post = {
    body: Joi.object({
        email: model.email.required(),
        password: model.password.required(),
        username: model.username.required(),
        roleId: model.roleId.required(),
    }),
}

const get = {
    query: Joi.object({
        skipPage: Joi.number(),
        limit: Joi.number().max(9999),
        status: Joi.string().valid(...statuses),
        gender: Joi.string().valid(...arrGender),
        'sort.id': Joi.number().valid(1, -1, '1', '-1'),
        'sort.username': Joi.number().valid(1, -1, '1', '-1'),
        'sort.firstName': Joi.number().valid(1, -1, '1', '-1'),
        'sort.lastName': Joi.number().valid(1, -1, '1', '-1'),
        'sort.status': Joi.number().valid(1, -1, '1', '-1'),
        'sort.email': Joi.number().valid(1, -1, '1', '-1'),
        q: Joi.string(),
        roleId: Joi.objectId(),
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

const resetPassword = {
    params: Joi.object({
        id: Joi.objectId().required(),
    }),
    body: Joi.object({
        value: model.password.required(),
    }),
}

const updateProfile = {
    body: updateBody,
}

const setMyPassword = {
    body: Joi.object({
        currentPassword: model.password.required(),
        value: model.password.required(),
    }),
}

module.exports = {
    post,
    get,
    idGet,
    idPut,
    idDelete,
    resetPassword,
    updateProfile,
    setMyPassword,
}

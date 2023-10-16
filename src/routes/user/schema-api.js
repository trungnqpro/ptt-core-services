const Joi = require('joi').extend(require('@joi/date'))
Joi.objectId = require('joi-objectid')(Joi)
const { mediaUrl } = require('../../libs/utils')

const { STATUS, GENDER } = require('../../resources').User.Static
const { ROLE_NAME } = require('../../resources').Role.Static

const statuses = Object.values(STATUS)
const arrGender = Object.values(GENDER)
const arrRoleName = Object.values(ROLE_NAME)

const regexUsername = /[a-zA-Z0-9-_.]/
const regexPassword = /[a-zA-Z0-9#?!@$%^&*-]/

const model = {
    email: Joi.string().email().max(500),
    username: Joi.string().regex(regexUsername).min(3).max(60),
    password: Joi.string().regex(regexPassword).min(6).max(256),
    name: Joi.string().max(256),
    gender: Joi.string().valid(...arrGender),
    phoneNumber: Joi.string().max(256),
    avatarUrl: Joi.string().regex(mediaUrl),
    address: Joi.string().max(500),
    birthday: Joi.date().format('YYYY-MM-DD'),
    roleName: Joi.string().valid(...arrRoleName),
    status: Joi.string().valid(...statuses),
}

const updateBody = Joi.object({
    name: model.name,
    gender: model.gender,
    email: model.email,
    phoneNumber: model.phoneNumber,
    avatarUrl: model.avatarUrl,
    address: model.address,
    birthday: model.birthday,
})

const post = {
    body: Joi.object({
        username: model.username.required(),
        password: model.password.required(),
        roleName: model.roleName.required(),
        email: model.email,
        name: model.name,
        gender: model.gender,
        phoneNumber: model.phoneNumber,
        avatarUrl: model.avatarUrl,
        address: model.address,
        birthday: model.birthday,
    }),
}

const get = {
    query: Joi.object({
        skipPage: Joi.number(),
        limit: Joi.number().max(9999),
        status: Joi.string().valid(...statuses),
        q: Joi.string(),
        roleName: Joi.string(),
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
        password: model.password.required(),
    }),
}

const updateProfile = {
    body: updateBody,
}

const setMyPassword = {
    body: Joi.object({
        currentPassword: model.password.required(),
        password: model.password.required(),
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

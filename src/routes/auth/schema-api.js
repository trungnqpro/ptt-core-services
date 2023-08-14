const Joi = require('joi').extend(require('@joi/date'))
Joi.objectId = require('joi-objectid')(Joi)
const { mediaUrl } = require('../../libs/utils')

const regexUsername = /[a-zA-Z0-9-_.]/
const regexPassword = /[a-zA-Z0-9#?!@$%^&*-]/

const definePassword = Joi.string().regex(regexPassword).min(6).max(256).required()

exports.login = {
    body: Joi.object({
        username: Joi.string().max(256).required(),
        password: definePassword,
    }),
}

exports.signup = {
    body: Joi.object({
        email: Joi.string().email().max(256).required(),
        password: definePassword,
        username: Joi.string().regex(regexUsername).min(3).max(30).required(),
        firstName: Joi.string().max(256),
        lastName: Joi.string().max(256),
        fullName: Joi.string().max(256),
        phoneNumber: Joi.string().max(256),
        avatarUrl: Joi.string().regex(mediaUrl),
        birthday: Joi.date().format('YYYY-MM-DD'),
    }),
}

exports.resendVerifyingEmail = {
    query: Joi.object({
        email: Joi.string().email().max(256).required(),
    }),
}

exports.getAccessToken = {
    query: Joi.object({
        refreshToken: Joi.string().required(),
    }),
}

exports.forgotPassword = {
    query: Joi.object({
        email: Joi.string().required(),
        callbackUrl: Joi.string().uri(),
    }),
}

exports.setPassword = {
    body: Joi.object({
        password: definePassword,
        token: Joi.string().required(),
    }),
}

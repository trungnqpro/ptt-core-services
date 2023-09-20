const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi, 'valid id')

exports.post = {
    body: Joi.object({
        files: Joi.array().items(Joi.any()),
    }),
}

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const mf = require('../../libs/mongo-field')
const { DefaultDB } = require('../../connections/mongodb')
const types = Object.values(require('./static').TYPE)

const schema = new Schema(
    {
        _id: mf().id().required().auto().j(),
        description: mf().string().j(),
        title: mf().string().j(),
        isDeleted: mf().boolean(false).j(),
        type: mf().string(types),
        emailDeliveryTime: mf().number().j(),
    },
    { timestamps: true },
)

module.exports = DefaultDB.model('EmailTemplate', schema, 'emailTemplate')

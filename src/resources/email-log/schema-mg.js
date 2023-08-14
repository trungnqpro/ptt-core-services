const mongoose = require('mongoose')
const Schema = mongoose.Schema

const mf = require('../../libs/mongo-field')
const { DefaultDB } = require('../../connections/mongodb')

const schema = new Schema(
    {
        _id: mf().id().required().auto().j(),
        sendToUserId: mf().id().ref('User').j(),
        sendToUserEmail: mf().string().j(),
        templateId: mf().id().ref('EmailTemplate').j(),
        type: mf().string().j(),
        status: mf().string().j(),
    },
    { timestamps: true },
)

module.exports = DefaultDB.model('EmailLog', schema, 'emailLog')

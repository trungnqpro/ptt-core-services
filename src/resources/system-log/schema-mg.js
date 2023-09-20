const mongoose = require('mongoose')
const Schema = mongoose.Schema

const { DefaultDB } = require('../../connections/mongodb')
const mf = require('../../libs/mongo-field')
const { GET } = require('./static').ACTION_TYPE

const schema = new Schema(
    {
        _id: mf().id().required().auto().j(),
        actionType: mf().string(GET).required().j(),
        functionName: mf().string().required().j(),
        targetId: mf().id().required().auto().j(),
        description: mf().string().j(),
        createdBy: mf().id().ref('User').required().j(),
        updatedBy: mf().id().ref('User').j(),
    },
    { timestamps: true },
)

module.exports = DefaultDB.model('SystemLog', schema, 'systemLog')

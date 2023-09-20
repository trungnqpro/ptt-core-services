const mongoose = require('mongoose')
const Schema = mongoose.Schema

const { DefaultDB } = require('../../connections/mongodb')
const mf = require('../../libs/mongo-field')

const schema = new Schema(
    {
        _id: mf().id().required().auto().j(),
        title: mf().string().required().j(),
        comment: mf().string().j(),
        targetId: mf().id().required().auto().j(),
        targetType: mf().string().required().j(),
        createdBy: mf().id().ref('User').required().j(),
    },
    { timestamps: true },
)

module.exports = DefaultDB.model('Feedback', schema, 'feedbacks')

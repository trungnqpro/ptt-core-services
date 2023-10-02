const mongoose = require('mongoose')
const Schema = mongoose.Schema

const { DefaultDB } = require('../../connections/mongodb')
const mf = require('../../libs/mongo-field')

const schema = new Schema(
    {
        _id: mf().id().required().auto().j(),
        // objectId: mf().id().ref().j(),
        // objectType: mf().string().j(),
        feedbackCounts: mf().number().j(),
        viewCounts: mf().number().j(),
    },
    { timestamps: true },
)

module.exports = DefaultDB.model('Statistic', schema, 'statistics')

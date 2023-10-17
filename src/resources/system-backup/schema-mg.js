const mongoose = require('mongoose')
const Schema = mongoose.Schema

const { DefaultDB } = require('../../connections/mongodb')
const mf = require('../../libs/mongo-field')

const schema = new Schema(
    {
        _id: mf().id().required().auto().j(),
        name: mf().string().required().j(),
        url: mf().string().required().j(),
        createdBy: mf().id().ref('User').required().j(),
    },
    { timestamps: true },
)

module.exports = DefaultDB.model('SystemBackup', schema, 'systemBackup')

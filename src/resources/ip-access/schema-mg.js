const mongoose = require('mongoose')
const Schema = mongoose.Schema

const { DefaultDB } = require('../../connections/mongodb')
const mf = require('../../libs/mongo-field')
const { ALLOW } = require('./static').STATUS


const schema = new Schema(
    {
        _id: mf().id().required().auto().j(),
        ipAddress: mf().string().required().j(),
        status: mf().string().required(ALLOW).j(),
        lastTimeAt: mf().date().j(),
        createdBy: mf().id().ref('User').required().j(),
        updatedBy: mf().id().ref('User').j(),
    },
    { timestamps: true },
)

module.exports = DefaultDB.model('IpAccess', schema, 'ipAccess')

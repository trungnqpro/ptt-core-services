const mongoose = require('mongoose')
const Schema = mongoose.Schema

const { DefaultDB } = require('../../connections/mongodb')
const mf = require('../../libs/mongo-field')

const schema = new Schema(
    {
        _id: mf().id().required().auto().j(),
        name: mf().string().required().j(),
        description: mf().string().j(),
        parentId: mf().id().ref('SystemFolder').j(),
        createdBy: mf().id().ref('User').required().j(),
        updatedBy: mf().id().ref('User').j(),
    },
    { timestamps: true },
)

module.exports = DefaultDB.model('SystemFolder', schema, 'systemFolder')

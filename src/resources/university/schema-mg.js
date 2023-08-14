const mongoose = require('mongoose')
const Schema = mongoose.Schema

const mf = require('../../libs/mongo-field')
const { DefaultDB } = require('../../connections/mongodb')

const schema = new Schema(
    {
        _id: mf().id().required().auto().j(),
        name: mf().string().required().j(),
        isDeleted: mf().boolean(false).j(),
    },
    { timestamps: true },
)

module.exports = DefaultDB.model('University', schema, 'university')

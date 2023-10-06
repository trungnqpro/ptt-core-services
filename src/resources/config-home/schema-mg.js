const mongoose = require('mongoose')
const Schema = mongoose.Schema

const { DefaultDB } = require('../../connections/mongodb')
const mf = require('../../libs/mongo-field')

const schema = new Schema(
    {
        _id: mf().id().required().auto().j(),
        videoUrl: mf().mediaUrl().required().j(),
        isLoop: mf().boolean(true).j(),
        delay: mf().number(5).j(), // default delay 5s
        createdBy: mf().id().ref('User').required().j(),
        updatedBy: mf().id().ref('User').j(),
    },
    { timestamps: true },
)

module.exports = DefaultDB.model('Model', schema, 'configHome')

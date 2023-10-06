const mongoose = require('mongoose')
const Schema = mongoose.Schema

const { DefaultDB } = require('../../connections/mongodb')
const mf = require('../../libs/mongo-field')

const schema = new Schema(
    {
        _id: mf().id().required().auto().j(),
        title: mf().string().required().j(),
        periodStart: mf().date().j(),
        periodEnd: mf().date().j(),
        folderId: mf().id().ref('SystemFolder').j(),
        caption: mf().string().j(),
        orderNum: mf().number().j(),
        videoUrl: mf().mediaUrl().j(),
        imageUrl: mf().mediaUrl().j(),
        audioUrl: mf().mediaUrl().j(),
        createdBy: mf().id().ref('User').required().j(),
        updatedBy: mf().id().ref('User').j(),
    },
    { timestamps: true },
)

module.exports = DefaultDB.model('GovermentMemory', schema, 'govermentMemories')

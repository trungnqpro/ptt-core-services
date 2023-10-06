const mongoose = require('mongoose')
const Schema = mongoose.Schema

const { DefaultDB } = require('../../connections/mongodb')
const mf = require('../../libs/mongo-field')

const schema = new Schema(
    {
        _id: mf().id().required().auto().j(),
        name: mf().string().required().j(),
        type: mf().id().ref('DocumentaryType').required().j(),
        folderId: mf().id().ref('SystemFolder').required().j(),
        orderNum: mf().number().j(),
        caption: mf().string().j(),
        videoUrl: mf().mediaUrl().j(),
        imageUrl: mf().mediaUrl().j(),
        audioUrl: mf().mediaUrl().j(),
        createdBy: mf().id().ref('User').required().j(),
        updatedBy: mf().id().ref('User').j(),
    },
    { timestamps: true },
)

schema.index({ name: 1 }, { unique: true })
module.exports = DefaultDB.model('Documentary', schema, 'documentary')

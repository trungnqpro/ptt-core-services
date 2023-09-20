const mongoose = require('mongoose')
const Schema = mongoose.Schema

const { DefaultDB } = require('../../connections/mongodb')
const mf = require('../../libs/mongo-field')

const schema = new Schema(
    {
        _id: mf().id().required().auto().j(),
        name: mf().string().required().j(),
        departmentId: mf().id().ref('Department').j(),
        positionId: mf().id().ref('Position').j(),
        badgeId: mf().id().ref('Badge').j(),
        folderId: mf().id().ref('ConfigFolder').j(),
        periodStart: mf().date().j(),
        periodEnd: mf().date().j(),
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

module.exports = DefaultDB.model('Leader', schema, 'leaders')

const mongoose = require('mongoose')
const mongooseLeanGetters = require('mongoose-lean-getters')
const Schema = mongoose.Schema

const { DefaultDB } = require('../../connections/mongodb')
const mf = require('../../libs').mongoField
const { ACTIVE, PENDING } = require('./static').STATUS

const schema = new Schema(
    {
        _id: mf().id().required().auto().j(),
        roleId: mf().id().required().ref('Role').j(),
        email: mf().string().trim().j(),
        phoneNumber: mf().string().trim().j(),
        username: mf().string().required().trim().j(),
        hashPassword: mf().string().required().trim().j(),
        firstName: String,
        lastName: String,
        birthday: Date,
        avatarUrl: mf().mediaUrl().j(),
        fullAddress: String,
        gender: String,
        status: mf().string(PENDING).j(),
        createdBy: mf().id().required().ref('User').j(),
        updatedBy: mf().id().ref('User').j(),
    },
    { timestamps: true },
)

schema.plugin(mongooseLeanGetters)

schema.index({ username: 1 }, { unique: true })
schema.index({ email: 1 }, { unique: true })
schema.index({ code: -1 }, { unique: true })

module.exports = DefaultDB.model('User', schema, 'users')

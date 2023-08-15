const mongoose = require('mongoose')
const mongooseLeanGetters = require('mongoose-lean-getters')
const Schema = mongoose.Schema

const { DefaultDB } = require('../../connections/mongodb')
const mf = require('../../libs').mongoField
const { ACTIVE } = require('./static').STATUS

const initStateSchema = new Schema(
    {
        curriculumId: mf().id().ref('Curriculum').j(),
    },
    { _id: false },
)

const schema = new Schema(
    {
        _id: mf().id().required().auto().j(),
        roleId: mf().id().ref('Role').j(),
        type: String,
        email: mf().string().trim().j(),
        phoneNumber: String,
        username: mf().string().trim().j(),
        hashPassword: String,
        firstName: String,
        lastName: String,
        birthday: Date,
        avatarUrl: mf().mediaUrl().j(),
        fullAddress: String,
        gender: String,
        status: mf().string(ACTIVE).j(),
        // initState: initStateSchema,
    },
    { timestamps: true },
)

schema.plugin(mongooseLeanGetters)

schema.index({ username: 1 }, { unique: true })
schema.index({ email: 1 }, { unique: true })
schema.index({ code: -1 }, { unique: true })

module.exports = DefaultDB.model('User', schema, 'users')

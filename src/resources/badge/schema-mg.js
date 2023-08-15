const mongoose = require('mongoose')
const Schema = mongoose.Schema

const { DefaultDB } = require('../../connections/mongodb')
const { ACTIVE } = require('./static').STATUS
const mf = require('../../libs/mongo-field')

const schema = new Schema(
    {
        _id: {
            type: Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        updatedBy: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        status: mf().string(ACTIVE).j(),
    },
    { timestamps: true },
)

module.exports = DefaultDB.model('Badge', schema, 'badges')

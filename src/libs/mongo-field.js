/**
 * @fileoverview Module định nghĩa các kiểu dữ liệu khai báo trong mongoose schema.
 *
 * @module libs/debug
 */
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const { STATIC_BASE_URL } = process.env
function MongoField() {
    return this
}

function mf() {
    return new MongoField()
}

MongoField.prototype.id = function (defaultValue) {
    genType.call(this, defaultValue, Schema.Types.ObjectId)
    return this
}

MongoField.prototype.string = function (defaultValue) {
    genType.call(this, defaultValue, String)
    return this
}

MongoField.prototype.number = function (defaultValue) {
    genType.call(this, defaultValue, Number)
    return this
}

MongoField.prototype.boolean = function (defaultValue) {
    genType.call(this, defaultValue, Boolean)
    return this
}

MongoField.prototype.date = function (defaultValue) {
    genType.call(this, defaultValue, Date)
    return this
}

MongoField.prototype.buffer = function (defaultValue) {
    genType.call(this, defaultValue, Buffer)
    return this
}

MongoField.prototype.decimal128 = function (defaultValue) {
    genType.call(this, defaultValue, Schema.Types.Decimal128)
    return this
}

MongoField.prototype.mixed = function (defaultValue) {
    genType.call(this, defaultValue, Schema.Types.Mixed)
    return this
}

MongoField.prototype.lowercase = function (lowercase = true) {
    this.lowercase = lowercase
    return this
}

MongoField.prototype.uppercase = function (uppercase = true) {
    this.uppercase = uppercase
    return this
}

MongoField.prototype.trim = function (trim = true) {
    this.trim = trim
    return this
}

MongoField.prototype.required = function (required = true) {
    this.required = required
    return this
}

MongoField.prototype.auto = function (auto = true) {
    this.auto = auto
    return this
}

MongoField.prototype.enum = function (e) {
    this.enum = e
    return this
}

MongoField.prototype.ref = function (ref) {
    this.ref = ref
    return this
}
MongoField.prototype.enum = function (array) {
    if (!Array.isArray(array)) {
        throw new Error('Parameter of enum must be an array')
    }
    this.enum = array
    return this
}

MongoField.prototype.min = function (val) {
    this.min = val
    return this
}

MongoField.prototype.max = function (val) {
    this.max = val
    return this
}

MongoField.prototype.get = function (getter) {
    if (typeof getter !== 'function') {
        throw new Error('Getter must be a function')
    }

    this.get = getter
    return this
}

MongoField.prototype.mediaUrl = function () {
    this.type = String
    this.get = path =>
        !path || /(data|http|https):.*/.test(path)
            ? path
            : `${STATIC_BASE_URL}/${path}`

    this.set = path => {
        if (!path) {
            return
        }
        let val = path
        val = val
            .replace(`${STATIC_BASE_URL}/`, '')
            .replace(/\?.*/, '')
        return val
    }

    return this
}

MongoField.prototype.toJSON = function () {
    return {
        ...this,
    }
}

MongoField.prototype.j = function () {
    return this.toJSON()
}

function genType(defaultValue, type) {
    if (type) {
        this.type = type
    }
    if (defaultValue !== undefined) {
        this.default = defaultValue
    }
}

module.exports = mf

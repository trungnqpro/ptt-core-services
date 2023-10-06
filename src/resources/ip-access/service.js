/**
 * @fileoverview Module xử lý nghiệp vụ cho phân quyền tài khoản (Model)
 *
 * @module resources/announcement/service
 */

const _ = require('lodash')
const { errors } = require('../../libs')
const ModelModel = require('./model')
const permissionCodes = require('../../configs/permissions').permissionCodes

const { ValidationError } = errors

/**
 * Lấy danh sách tất cả các entity
 * @returns {Model}
 */
exports.fetch = async (skip = 0, limit = 20, filter, sort) => {
    const _filter = { ...filter }
    if (_filter.q) {
        const q = _filter.q.toLowerCase().trim()
        delete _filter.q
        _filter.$or = [{ name: { $regex: q, $options: 'i' } }]
    }

    const [configBackups, total] = await Promise.all([
        ModelModel.fetch(skip, limit, _filter, sort),
        ModelModel.getTotalNumber(_filter),
    ])

    return { configBackups, total }
}

/**
 * Tạo mới entity
 * @param {Object} fields
 * @returns {Model}
 */
exports.create = async fields => {
    return await ModelModel.create(fields)
}

/**
 * Get entity by id
 * @param {String} id
 * @returns {Model}
 */
exports.getById = async id => {
    return await ModelModel.getById(id)
}

/**
 * Cập nhật thông tin entity bởi id
 * @param {String} id
 * @param {Object} updatedFields new value of fields
 * @returns {Model}
 */
exports.updateById = async (id, updatedFields) => {
    return await ModelModel.updateById(id, updatedFields)
}

/**
 * Xoa entity bởi id
 * @param {String} id
 * @returns {Model}
 */
exports.deleteById = async id => {
    return await ModelModel.deleteById(id)
}

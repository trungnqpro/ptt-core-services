/**
 * @fileoverview Module xử lý nghiệp vụ cho phân quyền tài khoản (ConfigHome)
 *
 * @module resources/announcement/service
 */

const _ = require('lodash')
const { errors } = require('../../libs')
const ConfigHomeModel = require('./model')
const permissionCodes = require('../../configs/permissions').permissionCodes

const { ValidationError } = errors

/**
 * Lấy danh sách tất cả các entity
 * @returns {ConfigHome}
 */
exports.fetch = async (skip = 0, limit = 20, filter, sort) => {
    const _filter = { ...filter }
    if (_filter.q) {
        const q = _filter.q.toLowerCase().trim()
        delete _filter.q
        _filter.$or = [{ name: { $regex: q, $options: 'i' } }]
    }

    const [configBackups, total] = await Promise.all([
        ConfigHomeModel.fetch(skip, limit, _filter, sort),
        ConfigHomeModel.getTotalNumber(_filter),
    ])

    return { configBackups, total }
}

/**
 * Tạo mới entity
 * @param {Object} fields
 * @returns {ConfigHome}
 */
exports.create = async fields => {
    return await ConfigHomeModel.create(fields)
}

/**
 * Get entity by id
 * @param {String} id
 * @returns {ConfigHome}
 */
exports.getById = async id => {
    return await ConfigHomeModel.getById(id)
}

/**
 * Cập nhật thông tin entity bởi id
 * @param {String} id
 * @param {Object} updatedFields new value of fields
 * @returns {ConfigHome}
 */
exports.updateById = async (id, updatedFields) => {
    return await ConfigHomeModel.updateById(id, updatedFields)
}

/**
 * Xoa entity bởi id
 * @param {String} id
 * @returns {ConfigHome}
 */
exports.deleteById = async id => {
    return await ConfigHomeModel.deleteById(id)
}

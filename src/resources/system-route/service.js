/**
 * @fileoverview Module xử lý nghiệp vụ cho phân quyền tài khoản (SystemRoute)
 *
 * @module resources/announcement/service
 */

const _ = require('lodash')
const { errors } = require('../../libs')
const ConfigMenuModel = require('./model')
const permissionCodes = require('../../configs/permissions').permissionCodes

const { ValidationError } = errors

/**
 * Lấy danh sách tất cả các entity
 * @returns {SystemRoute}
 */
exports.fetch = async (skip = 0, limit = 20, filter, sort) => {
    const _filter = { ...filter }
    if (_filter.q) {
        const q = _filter.q.toLowerCase().trim()
        delete _filter.q
        _filter.$or = [{ name: { $regex: q, $options: 'i' } }]
    }

    const [configBackups, total] = await Promise.all([
        ConfigMenuModel.fetch(skip, limit, _filter, sort),
        ConfigMenuModel.getTotalNumber(_filter),
    ])

    return { configBackups, total }
}

/**
 * Tạo mới entity
 * @param {Object} fields
 * @returns {SystemRoute}
 */
exports.create = async fields => {
    return await ConfigMenuModel.create(fields)
}

/**
 * Get entity by id
 * @param {String} id
 * @returns {SystemRoute}
 */
exports.getById = async id => {
    return await ConfigMenuModel.getById(id)
}

/**
 * Cập nhật thông tin entity bởi id
 * @param {String} id
 * @param {Object} updatedFields new value of fields
 * @returns {SystemRoute}
 */
exports.updateById = async (id, updatedFields) => {
    return await ConfigMenuModel.updateById(id, updatedFields)
}

/**
 * Xoa entity bởi id
 * @param {String} id
 * @returns {SystemRoute}
 */
exports.deleteById = async id => {
    return await ConfigMenuModel.deleteById(id)
}

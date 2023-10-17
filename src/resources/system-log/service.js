/**
 * @fileoverview Module xử lý nghiệp vụ cho phân quyền tài khoản (ConfigLog)
 *
 * @module resources/announcement/service
 */

const _ = require('lodash')
const { errors } = require('../../libs')
const Model = require('./model')
const permissionCodes = require('../../configs/permissions').permissionCodes

const { ValidationError } = errors

/**
 * Lấy danh sách tất cả các entity
 * @returns {ConfigLog}
 */
exports.fetch = async (skip = 0, limit = 20, filter, sort) => {
    const _filter = { ...filter }
    if (_filter.q) {
        const q = _filter.q.toLowerCase().trim()
        delete _filter.q
        _filter.$or = [{ name: { $regex: q, $options: 'i' } }]
    }

    const [items, total] = await Promise.all([
        Model.fetch(skip, limit, _filter, sort),
        Model.getTotalNumber(_filter),
    ])

    return { items, total }
}

/**
 * Tạo mới entity
 * @param {Object} fields
 * @returns {ConfigLog}
 */
exports.create = async fields => {
    return await Model.create(fields)
}

/**
 * Get entity by id
 * @param {String} id
 * @returns {ConfigLog}
 */
exports.getById = async id => {
    return await Model.getById(id)
}

/**
 * Cập nhật thông tin entity bởi id
 * @param {String} id
 * @param {Object} updatedFields new value of fields
 * @returns {ConfigLog}
 */
exports.updateById = async (id, updatedFields) => {
    return await Model.updateById(id, updatedFields)
}

/**
 * Xoa entity bởi id
 * @param {String} id
 * @returns {ConfigLog}
 */
exports.deleteById = async id => {
    return await Model.deleteById(id)
}

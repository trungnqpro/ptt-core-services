/**
 * @fileoverview Module xử lý nghiệp vụ cho phân quyền tài khoản (Badge)
 *
 * @module resources/announcement/service
 */

const _ = require('lodash')
const { errors } = require('../../libs')
const BadgeModel = require('./model')
const permissionCodes = require('../../configs/permissions').permissionCodes

const { ValidationError } = errors

/**
 * Lấy danh sách tất cả các entity
 * @returns {Badge}
 */
exports.fetch = async (skip = 0, limit = 20, filter, sort) => {
    const _filter = { ...filter }
    if (_filter.q) {
        const q = _filter.q.toLowerCase().trim()
        delete _filter.q
        _filter.$or = [{ name: { $regex: q, $options: 'i' } }]
    }

    const [badges, total] = await Promise.all([
        BadgeModel.fetch(skip, limit, _filter, sort),
        BadgeModel.getTotalNumber(_filter),
    ])

    return { badges, total }
}

/**
 * Tạo mới entity
 * @param {Object} fields
 * @returns {Badge}
 */
exports.create = async fields => {
    return await BadgeModel.create(fields)
}

/**
 * Get entity by id
 * @param {String} id
 * @returns {Badge}
 */
exports.getById = async id => {
    return await BadgeModel.getById(id)
}

/**
 * Cập nhật thông tin entity bởi id
 * @param {String} id
 * @param {Object} updatedFields new value of fields
 * @returns {Badge}
 */
exports.updateById = async (id, updatedFields) => {
    return await BadgeModel.updateById(id, updatedFields)
}

/**
 * Xoa entity bởi id
 * @param {String} id
 * @returns {Badge}
 */
exports.deleteById = async id => {
    return await BadgeModel.deleteById(id)
}

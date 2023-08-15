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
 * Lấy danh sách tất cả các role
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
 * Tạo mới một role
 * @param {Object} fields
 * @returns {Badge}
 */
exports.create = async fields => {
    const role = await BadgeModel.create(fields)

    return role
}

/**
 * Get role by id
 * @param {String} id
 * @returns {Badge}
 */
exports.getById = async id => {
    const role = await BadgeModel.getById(id)

    return role
}

/**
 * Cập nhật thông tin role bởi id
 * @param {String} id
 * @param {Object} updatedFields new value of fields
 * @returns {Badge}
 */
exports.updateById = async (id, updatedFields) => {
    const role = await BadgeModel.updateById(id, updatedFields)

    return role
}

/**
 * Xoa một role bởi id
 * @param {String} id
 * @returns {Badge}
 */
exports.deleteById = async id => {
    const result = await BadgeModel.deleteById(id)
    return result
}

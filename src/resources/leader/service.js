/**
 * @fileoverview Module xử lý nghiệp vụ cho phân quyền tài khoản (Leader)
 *
 * @module resources/announcement/service
 */

const _ = require('lodash')
const { errors } = require('../../libs')
const LeaderModel = require('./model')
const permissionCodes = require('../../configs/permissions').permissionCodes

const { ValidationError } = errors

/**
 * Lấy danh sách tất cả các role
 * @returns {Leader}
 */
exports.fetch = async (skip = 0, limit = 20, filter, sort) => {
    const _filter = { ...filter }
    if (_filter.q) {
        const q = _filter.q.toLowerCase().trim()
        delete _filter.q
        _filter.$or = [{ name: { $regex: q, $options: 'i' } }]
    }

    const [departments, total] = await Promise.all([
        LeaderModel.fetch(skip, limit, _filter, sort),
        LeaderModel.getTotalNumber(_filter),
    ])

    return { departments, total }
}

/**
 * Tạo mới một role
 * @param {Object} fields
 * @returns {Leader}
 */
exports.create = async fields => {
    return await LeaderModel.create(fields)
}

/**
 * Get role by id
 * @param {String} id
 * @returns {Leader}
 */
exports.getById = async id => {
    return await LeaderModel.getById(id)
}

/**
 * Cập nhật thông tin role bởi id
 * @param {String} id
 * @param {Object} updatedFields new value of fields
 * @returns {Leader}
 */
exports.updateById = async (id, updatedFields) => {
    return await LeaderModel.updateById(id, updatedFields)
}

/**
 * Xoa một role bởi id
 * @param {String} id
 * @returns {Leader}
 */
exports.deleteById = async id => {
    return await LeaderModel.deleteById(id)
}

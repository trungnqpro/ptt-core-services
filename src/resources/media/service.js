/**
 * @fileoverview Module xử lý nghiệp vụ cho phân quyền tài khoản (Media)
 *
 * @module resources/announcement/service
 */

const _ = require('lodash')
const { errors } = require('../../libs')
const MediaModel = require('./model')
const permissionCodes = require('../../configs/permissions').permissionCodes

const { ValidationError } = errors

/**
 * Lấy danh sách tất cả các entity
 * @returns {Media}
 */
exports.fetch = async (skip = 0, limit = 20, filter, sort) => {
    const _filter = { ...filter }
    if (_filter.q) {
        const q = _filter.q.toLowerCase().trim()
        delete _filter.q
        _filter.$or = [{ name: { $regex: q, $options: 'i' } }]
    }

    const [departments, total] = await Promise.all([
        MediaModel.fetch(skip, limit, _filter, sort),
        MediaModel.getTotalNumber(_filter),
    ])

    return { departments, total }
}

/**
 * Tạo mới entity
 * @param {Object} fields
 * @returns {Media}
 */
exports.create = async fields => {
    return await MediaModel.create(fields)
}

/**
 * Get entity by id
 * @param {String} id
 * @returns {Media}
 */
exports.getById = async id => {
    return await MediaModel.getById(id)
}

/**
 * Cập nhật thông tin entity bởi id
 * @param {String} id
 * @param {Object} updatedFields new value of fields
 * @returns {Media}
 */
exports.updateById = async (id, updatedFields) => {
    return await MediaModel.updateById(id, updatedFields)
}

/**
 * Xoa entity bởi id
 * @param {String} id
 * @returns {Media}
 */
exports.deleteById = async id => {
    return await MediaModel.deleteById(id)
}

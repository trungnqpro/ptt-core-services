/**
 * @fileoverview Module xử lý nghiệp vụ cho phân quyền tài khoản (GovermentPost)
 *
 * @module resources/announcement/service
 */

const _ = require('lodash')
const { errors } = require('../../libs')
const GovermentPostModel = require('./model')
const permissionCodes = require('../../configs/permissions').permissionCodes

const { ValidationError } = errors

/**
 * Lấy danh sách tất cả các role
 * @returns {GovermentPost}
 */
exports.fetch = async (skip = 0, limit = 20, filter, sort) => {
    const _filter = { ...filter }
    if (_filter.q) {
        const q = _filter.q.toLowerCase().trim()
        delete _filter.q
        _filter.$or = [{ name: { $regex: q, $options: 'i' } }]
    }

    const [departments, total] = await Promise.all([
        GovermentPostModel.fetch(skip, limit, _filter, sort),
        GovermentPostModel.getTotalNumber(_filter),
    ])

    return { departments, total }
}

/**
 * Tạo mới một role
 * @param {Object} fields
 * @returns {GovermentPost}
 */
exports.create = async fields => {
    return await GovermentPostModel.create(fields)
}

/**
 * Get role by id
 * @param {String} id
 * @returns {GovermentPost}
 */
exports.getById = async id => {
    return await GovermentPostModel.getById(id)
}

/**
 * Cập nhật thông tin role bởi id
 * @param {String} id
 * @param {Object} updatedFields new value of fields
 * @returns {GovermentPost}
 */
exports.updateById = async (id, updatedFields) => {
    return await GovermentPostModel.updateById(id, updatedFields)
}

/**
 * Xoa một role bởi id
 * @param {String} id
 * @returns {GovermentPost}
 */
exports.deleteById = async id => {
    return await GovermentPostModel.deleteById(id)
}

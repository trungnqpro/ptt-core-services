/**
 * @fileoverview Module xử lý nghiệp vụ cho phân quyền tài khoản (GovermentMemory)
 *
 * @module resources/announcement/service
 */

const _ = require('lodash')
const { errors } = require('../../libs')
const GovermentPostModel = require('./model')
const permissionCodes = require('../../configs/permissions').permissionCodes

const { ValidationError } = errors

/**
 * Lấy danh sách tất cả các entity
 * @returns {GovermentMemory}
 */
exports.fetch = async (skip = 0, limit = 20, filter, sort) => {
    const _filter = { ...filter }
    if (_filter.q) {
        const q = _filter.q.toLowerCase().trim()
        delete _filter.q
        _filter.$or = [{ name: { $regex: q, $options: 'i' } }]
    }

    const [govermentMemories, total] = await Promise.all([
        GovermentPostModel.fetch(skip, limit, _filter, sort),
        GovermentPostModel.getTotalNumber(_filter),
    ])

    return { govermentMemories, total }
}

/**
 * Tạo mới entity
 * @param {Object} fields
 * @returns {GovermentMemory}
 */
exports.create = async fields => {
    return await GovermentPostModel.create(fields)
}

/**
 * Get entity by id
 * @param {String} id
 * @returns {GovermentMemory}
 */
exports.getById = async id => {
    return await GovermentPostModel.getById(id)
}

/**
 * Cập nhật thông tin entity bởi id
 * @param {String} id
 * @param {Object} updatedFields new value of fields
 * @returns {GovermentMemory}
 */
exports.updateById = async (id, updatedFields) => {
    return await GovermentPostModel.updateById(id, updatedFields)
}

/**
 * Xoa entity bởi id
 * @param {String} id
 * @returns {GovermentMemory}
 */
exports.deleteById = async id => {
    return await GovermentPostModel.deleteById(id)
}

/**
 * @fileoverview Module xử lý nghiệp vụ cho phân quyền tài khoản (DocumentaryType)
 *
 * @module resources/announcement/service
 */

const _ = require('lodash')
const { errors } = require('../../libs')
const DocumentaryTypeModel = require('./model')
const permissionCodes = require('../../configs/permissions').permissionCodes

const { ValidationError } = errors

/**
 * Lấy danh sách tất cả các entity
 * @returns {DocumentaryType}
 */
exports.fetch = async (skip = 0, limit = 20, filter, sort) => {
    const _filter = { ...filter }
    if (_filter.q) {
        const q = _filter.q.toLowerCase().trim()
        delete _filter.q
        _filter.$or = [{ name: { $regex: q, $options: 'i' } }]
    }

    const [documentaryTypes, total] = await Promise.all([
        DocumentaryTypeModel.fetch(skip, limit, _filter, sort),
        DocumentaryTypeModel.getTotalNumber(_filter),
    ])

    return { documentaryTypes, total }
}

/**
 * Tạo mới entity
 * @param {Object} fields
 * @returns {DocumentaryType}
 */
exports.create = async fields => {
    return await DocumentaryTypeModel.create(fields)
}

/**
 * Get entity by id
 * @param {String} id
 * @returns {DocumentaryType}
 */
exports.getById = async id => {
    return await DocumentaryTypeModel.getById(id)
}

/**
 * Cập nhật thông tin entity bởi id
 * @param {String} id
 * @param {Object} updatedFields new value of fields
 * @returns {DocumentaryType}
 */
exports.updateById = async (id, updatedFields) => {
    return await DocumentaryTypeModel.updateById(id, updatedFields)
}

/**
 * Xoa entity bởi id
 * @param {String} id
 * @returns {DocumentaryType}
 */
exports.deleteById = async id => {
    return await DocumentaryTypeModel.deleteById(id)
}

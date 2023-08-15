/**
 * @fileoverview Module xử lý nghiệp vụ cho phân quyền tài khoản (DocumentType)
 *
 * @module resources/announcement/service
 */

const _ = require('lodash')
const { errors } = require('../../libs')
const DocumentTypeModel = require('./model')
const permissionCodes = require('../../configs/permissions').permissionCodes

const { ValidationError } = errors

/**
 * Lấy danh sách tất cả các role
 * @returns {DocumentType}
 */
exports.fetch = async (skip = 0, limit = 20, filter, sort) => {
    const _filter = { ...filter }
    if (_filter.q) {
        const q = _filter.q.toLowerCase().trim()
        delete _filter.q
        _filter.$or = [{ name: { $regex: q, $options: 'i' } }]
    }

    const [documentTypes, total] = await Promise.all([
        DocumentTypeModel.fetch(skip, limit, _filter, sort),
        DocumentTypeModel.getTotalNumber(_filter),
    ])

    return { documentTypes, total }
}

/**
 * Tạo mới một role
 * @param {Object} fields
 * @returns {DocumentType}
 */
exports.create = async fields => {
    return await DocumentTypeModel.create(fields)
}

/**
 * Get role by id
 * @param {String} id
 * @returns {DocumentType}
 */
exports.getById = async id => {
    return await DocumentTypeModel.getById(id)
}

/**
 * Cập nhật thông tin role bởi id
 * @param {String} id
 * @param {Object} updatedFields new value of fields
 * @returns {DocumentType}
 */
exports.updateById = async (id, updatedFields) => {
    return await DocumentTypeModel.updateById(id, updatedFields)
}

/**
 * Xoa một role bởi id
 * @param {String} id
 * @returns {DocumentType}
 */
exports.deleteById = async id => {
    return await DocumentTypeModel.deleteById(id)
}

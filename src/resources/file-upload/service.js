/**
 * @fileoverview Module xử lý nghiệp vụ cho phân quyền tài khoản (FileUpload)
 *
 * @module resources/announcement/service
 */

const _ = require('lodash')
const { errors } = require('../../libs')
const FileUploadModel = require('./model')
const permissionCodes = require('../../configs/permissions').permissionCodes

const { ValidationError } = errors

/**
 * Lấy danh sách tất cả các entity
 * @returns {FileUpload}
 */
exports.fetch = async (skip = 0, limit = 20, filter, sort) => {
    const _filter = { ...filter }
    if (_filter.q) {
        const q = _filter.q.toLowerCase().trim()
        delete _filter.q
        _filter.$or = [{ name: { $regex: q, $options: 'i' } }]
    }

    const [departments, total] = await Promise.all([
        FileUploadModel.fetch(skip, limit, _filter, sort),
        FileUploadModel.getTotalNumber(_filter),
    ])

    return { departments, total }
}

/**
 * Tạo mới entity
 * @param {Object} fields
 * @returns {FileUpload}
 */
exports.create = async fields => {
    return await FileUploadModel.create(fields)
}

/**
 * Get entity by id
 * @param {String} id
 * @returns {FileUpload}
 */
exports.getById = async id => {
    return await FileUploadModel.getById(id)
}

/**
 * Cập nhật thông tin entity bởi id
 * @param {String} id
 * @param {Object} updatedFields new value of fields
 * @returns {FileUpload}
 */
exports.updateById = async (id, updatedFields) => {
    return await FileUploadModel.updateById(id, updatedFields)
}

/**
 * Xoa entity bởi id
 * @param {String} id
 * @returns {FileUpload}
 */
exports.deleteById = async id => {
    return await FileUploadModel.deleteById(id)
}

/**
 * @fileoverview Module xử lý nghiệp vụ cho phân quyền tài khoản (DataImport)
 *
 * @module resources/announcement/service
 */

const _ = require('lodash')
const { errors } = require('../../libs')
const DataImportModel = require('./model')
const permissionCodes = require('../../configs/permissions').permissionCodes

const { ValidationError } = errors

/**
 * Lấy danh sách tất cả các role
 * @returns {DataImport}
 */
exports.fetch = async (skip = 0, limit = 20, filter, sort) => {
    const _filter = { ...filter }
    if (_filter.q) {
        const q = _filter.q.toLowerCase().trim()
        delete _filter.q
        _filter.$or = [{ name: { $regex: q, $options: 'i' } }]
    }

    const [departments, total] = await Promise.all([
        DataImportModel.fetch(skip, limit, _filter, sort),
        DataImportModel.getTotalNumber(_filter),
    ])

    return { departments, total }
}

/**
 * Tạo mới một role
 * @param {Object} fields
 * @returns {DataImport}
 */
exports.create = async fields => {
    return await DataImportModel.create(fields)
}

/**
 * Get role by id
 * @param {String} id
 * @returns {DataImport}
 */
exports.getById = async id => {
    return await DataImportModel.getById(id)
}

/**
 * Cập nhật thông tin role bởi id
 * @param {String} id
 * @param {Object} updatedFields new value of fields
 * @returns {DataImport}
 */
exports.updateById = async (id, updatedFields) => {
    return await DataImportModel.updateById(id, updatedFields)
}

/**
 * Xoa một role bởi id
 * @param {String} id
 * @returns {DataImport}
 */
exports.deleteById = async id => {
    return await DataImportModel.deleteById(id)
}

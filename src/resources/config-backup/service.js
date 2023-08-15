/**
 * @fileoverview Module xử lý nghiệp vụ cho phân quyền tài khoản (ConfigBackup)
 *
 * @module resources/announcement/service
 */

const _ = require('lodash')
const { errors } = require('../../libs')
const ConfigBackupModel = require('./model')
const permissionCodes = require('../../configs/permissions').permissionCodes

const { ValidationError } = errors

/**
 * Lấy danh sách tất cả các role
 * @returns {ConfigBackup}
 */
exports.fetch = async (skip = 0, limit = 20, filter, sort) => {
    const _filter = { ...filter }
    if (_filter.q) {
        const q = _filter.q.toLowerCase().trim()
        delete _filter.q
        _filter.$or = [{ name: { $regex: q, $options: 'i' } }]
    }

    const [configBackups, total] = await Promise.all([
        ConfigBackupModel.fetch(skip, limit, _filter, sort),
        ConfigBackupModel.getTotalNumber(_filter),
    ])

    return { configBackups, total }
}

/**
 * Tạo mới một role
 * @param {Object} fields
 * @returns {ConfigBackup}
 */
exports.create = async fields => {
    return await ConfigBackupModel.create(fields)
}

/**
 * Get role by id
 * @param {String} id
 * @returns {ConfigBackup}
 */
exports.getById = async id => {
    return await ConfigBackupModel.getById(id)
}

/**
 * Cập nhật thông tin role bởi id
 * @param {String} id
 * @param {Object} updatedFields new value of fields
 * @returns {ConfigBackup}
 */
exports.updateById = async (id, updatedFields) => {
    return await ConfigBackupModel.updateById(id, updatedFields)
}

/**
 * Xoa một role bởi id
 * @param {String} id
 * @returns {ConfigBackup}
 */
exports.deleteById = async id => {
    return await ConfigBackupModel.deleteById(id)
}

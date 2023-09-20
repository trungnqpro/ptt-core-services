/**
 * @fileoverview Module xử lý nghiệp vụ cho phân quyền tài khoản (SystemBackup)
 *
 * @module resources/announcement/service
 */

const _ = require('lodash')
const { errors } = require('../../libs')
const ConfigBackupModel = require('./model')
const permissionCodes = require('../../configs/permissions').permissionCodes

const { ValidationError } = errors

/**
 * Lấy danh sách tất cả các entity
 * @returns {SystemBackup}
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
 * Tạo mới entity
 * @param {Object} fields
 * @returns {SystemBackup}
 */
exports.create = async fields => {
    return await ConfigBackupModel.create(fields)
}

/**
 * Get entity by id
 * @param {String} id
 * @returns {SystemBackup}
 */
exports.getById = async id => {
    return await ConfigBackupModel.getById(id)
}

/**
 * Cập nhật thông tin entity bởi id
 * @param {String} id
 * @param {Object} updatedFields new value of fields
 * @returns {SystemBackup}
 */
exports.updateById = async (id, updatedFields) => {
    return await ConfigBackupModel.updateById(id, updatedFields)
}

/**
 * Xoa entity bởi id
 * @param {String} id
 * @returns {SystemBackup}
 */
exports.deleteById = async id => {
    return await ConfigBackupModel.deleteById(id)
}

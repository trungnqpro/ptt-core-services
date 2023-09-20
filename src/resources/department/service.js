/**
 * @fileoverview Module xử lý nghiệp vụ cho phân quyền tài khoản (Department)
 *
 * @module resources/announcement/service
 */

const _ = require('lodash')
const { errors } = require('../../libs')
const DepartmentModel = require('./model')
const permissionCodes = require('../../configs/permissions').permissionCodes

const { ValidationError } = errors

/**
 * Lấy danh sách tất cả các entity
 * @returns {Department}
 */
exports.fetch = async (skip = 0, limit = 20, filter, sort) => {
    const _filter = { ...filter }
    if (_filter.q) {
        const q = _filter.q.toLowerCase().trim()
        delete _filter.q
        _filter.$or = [{ name: { $regex: q, $options: 'i' } }]
    }

    const [departments, total] = await Promise.all([
        DepartmentModel.fetch(skip, limit, _filter, sort),
        DepartmentModel.getTotalNumber(_filter),
    ])

    return { departments, total }
}

/**
 * Tạo mới entity
 * @param {Object} fields
 * @returns {Department}
 */
exports.create = async fields => {
    return await DepartmentModel.create(fields)
}

/**
 * Get entity by id
 * @param {String} id
 * @returns {Department}
 */
exports.getById = async id => {
    return await DepartmentModel.getById(id)
}

/**
 * Cập nhật thông tin entity bởi id
 * @param {String} id
 * @param {Object} updatedFields new value of fields
 * @returns {Department}
 */
exports.updateById = async (id, updatedFields) => {
    return await DepartmentModel.updateById(id, updatedFields)
}

/**
 * Xoa entity bởi id
 * @param {String} id
 * @returns {Department}
 */
exports.deleteById = async id => {
    return await DepartmentModel.deleteById(id)
}

/**
 * @fileoverview Module xử lý nghiệp vụ cho phân quyền tài khoản (ObjectMore)
 *
 * @module resources/announcement/service
 */

const _ = require('lodash')
const { errors } = require('../../libs')
const ObjectMoreModel = require('./model')
const permissionCodes = require('../../configs/permissions').permissionCodes

const { ValidationError } = errors

/**
 * Lấy danh sách tất cả các entity
 * @returns {ObjectMore}
 */
exports.fetch = async (skip = 0, limit = 20, filter, sort) => {
    const _filter = { ...filter }
    if (_filter.q) {
        const q = _filter.q.toLowerCase().trim()
        delete _filter.q
        _filter.$or = [{ name: { $regex: q, $options: 'i' } }]
    }

    const [objectMores, total] = await Promise.all([
        ObjectMoreModel.fetch(skip, limit, _filter, sort),
        ObjectMoreModel.getTotalNumber(_filter),
    ])

    return { objectMores, total }
}

/**
 * Tạo mới entity
 * @param {Object} fields
 * @returns {ObjectMore}
 */
exports.create = async fields => {
    return await ObjectMoreModel.create(fields)
}

/**
 * Get entity by id
 * @param {String} id
 * @returns {ObjectMore}
 */
exports.getBySourceId = async id => {
    return await ObjectMoreModel.getBySourceId(id)
}

/**
 * Get entity by id
 * @param {String} id
 * @returns {ObjectMore}
 */
exports.getById = async id => {
    return await ObjectMoreModel.getById(id)
}

/**
 * Cập nhật thông tin entity bởi id
 * @param {String} id
 * @param {Object} updatedFields new value of fields
 * @returns {ObjectMore}
 */
exports.updateById = async (id, updatedFields) => {
    return await ObjectMoreModel.updateById(id, updatedFields)
}

/**
 * Xoa entity bởi id
 * @param {String} id
 * @returns {ObjectMore}
 */
exports.deleteById = async id => {
    return await ObjectMoreModel.deleteById(id)
}

/**
 * @fileoverview Module xử lý nghiệp vụ cho phân quyền tài khoản (Position)
 *
 * @module resources/announcement/service
 */

const _ = require('lodash')
const { errors } = require('../../libs')
const PositionModel = require('./model')
const permissionCodes = require('../../configs/permissions').permissionCodes

const { ValidationError } = errors

/**
 * Lấy danh sách tất cả các entity
 * @returns {Position}
 */
exports.fetch = async (skip = 0, limit = 20, filter, sort) => {
    const _filter = { ...filter }
    if (_filter.q) {
        const q = _filter.q.toLowerCase().trim()
        delete _filter.q
        _filter.$or = [{ name: { $regex: q, $options: 'i' } }]
    }

    const [positions, total] = await Promise.all([
        PositionModel.fetch(skip, limit, _filter, sort),
        PositionModel.getTotalNumber(_filter),
    ])

    return { positions, total }
}

/**
 * Tạo mới entity
 * @param {Object} fields
 * @returns {Position}
 */
exports.create = async fields => {
    return await PositionModel.create(fields)
}

/**
 * Get entity by id
 * @param {String} id
 * @returns {Position}
 */
exports.getById = async id => {
    return await PositionModel.getById(id)
}

/**
 * Cập nhật thông tin entity bởi id
 * @param {String} id
 * @param {Object} updatedFields new value of fields
 * @returns {Position}
 */
exports.updateById = async (id, updatedFields) => {
    return await PositionModel.updateById(id, updatedFields)
}

/**
 * Xoa entity bởi id
 * @param {String} id
 * @returns {Position}
 */
exports.deleteById = async id => {
    return await PositionModel.deleteById(id)
}

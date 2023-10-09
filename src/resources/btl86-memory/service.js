/**
 * @fileoverview Module xử lý nghiệp vụ cho phân quyền tài khoản (Btl86Memory)
 *
 * @module resources/announcement/service
 */

const _ = require('lodash')
const { errors } = require('../../libs')
const Btl86PostModel = require('./model')
const permissionCodes = require('../../configs/permissions').permissionCodes

const { ValidationError } = errors

/**
 * Lấy danh sách tất cả các entity
 * @returns {Btl86Memory}
 */
exports.fetch = async (skip = 0, limit = 20, filter, sort) => {
    const _filter = { ...filter }
    if (_filter.q) {
        const q = _filter.q.toLowerCase().trim()
        delete _filter.q
        _filter.$or = [{ name: { $regex: q, $options: 'i' } }]
    }

    const [btlMemories, total] = await Promise.all([
        Btl86PostModel.fetch(skip, limit, _filter, sort),
        Btl86PostModel.getTotalNumber(_filter),
    ])

    return { btlMemories, total }
}

/**
 * Tạo mới entity
 * @param {Object} fields
 * @returns {Btl86Memory}
 */
exports.create = async fields => {
    return await Btl86PostModel.create(fields)
}

/**
 * Get entity by id
 * @param {String} id
 * @returns {Btl86Memory}
 */
exports.getById = async id => {
    return await Btl86PostModel.getById(id)
}

/**
 * Cập nhật thông tin entity bởi id
 * @param {String} id
 * @param {Object} updatedFields new value of fields
 * @returns {Btl86Memory}
 */
exports.updateById = async (id, updatedFields) => {
    return await Btl86PostModel.updateById(id, updatedFields)
}

/**
 * Xoa entity bởi id
 * @param {String} id
 * @returns {Btl86Memory}
 */
exports.deleteById = async id => {
    return await Btl86PostModel.deleteById(id)
}

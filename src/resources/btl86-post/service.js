/**
 * @fileoverview Module xử lý nghiệp vụ cho phân quyền tài khoản (Btl86Post)
 *
 * @module resources/announcement/service
 */

const _ = require('lodash')
const { errors } = require('../../libs')
const Btl86PostModel = require('./model')
const permissionCodes = require('../../configs/permissions').permissionCodes

const { ValidationError } = errors

/**
 * Lấy danh sách tất cả các role
 * @returns {Btl86Post}
 */
exports.fetch = async (skip = 0, limit = 20, filter, sort) => {
    const _filter = { ...filter }
    if (_filter.q) {
        const q = _filter.q.toLowerCase().trim()
        delete _filter.q
        _filter.$or = [{ name: { $regex: q, $options: 'i' } }]
    }

    const [departments, total] = await Promise.all([
        Btl86PostModel.fetch(skip, limit, _filter, sort),
        Btl86PostModel.getTotalNumber(_filter),
    ])

    return { departments, total }
}

/**
 * Tạo mới một role
 * @param {Object} fields
 * @returns {Btl86Post}
 */
exports.create = async fields => {
    return await Btl86PostModel.create(fields)
}

/**
 * Get role by id
 * @param {String} id
 * @returns {Btl86Post}
 */
exports.getById = async id => {
    return await Btl86PostModel.getById(id)
}

/**
 * Cập nhật thông tin role bởi id
 * @param {String} id
 * @param {Object} updatedFields new value of fields
 * @returns {Btl86Post}
 */
exports.updateById = async (id, updatedFields) => {
    return await Btl86PostModel.updateById(id, updatedFields)
}

/**
 * Xoa một role bởi id
 * @param {String} id
 * @returns {Btl86Post}
 */
exports.deleteById = async id => {
    return await Btl86PostModel.deleteById(id)
}

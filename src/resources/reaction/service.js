/**
 * @fileoverview Module xử lý nghiệp vụ cho phân quyền tài khoản (Reaction)
 *
 * @module resources/announcement/service
 */

const _ = require('lodash')
const { errors } = require('../../libs')
const ReactionModel = require('./model')
const permissionCodes = require('../../configs/permissions').permissionCodes

const { ValidationError } = errors

/**
 * Lấy danh sách tất cả các role
 * @returns {Reaction}
 */
exports.fetch = async (skip = 0, limit = 20, filter, sort) => {
    const _filter = { ...filter }
    if (_filter.q) {
        const q = _filter.q.toLowerCase().trim()
        delete _filter.q
        _filter.$or = [{ name: { $regex: q, $options: 'i' } }]
    }

    const [departments, total] = await Promise.all([
        ReactionModel.fetch(skip, limit, _filter, sort),
        ReactionModel.getTotalNumber(_filter),
    ])

    return { departments, total }
}

/**
 * Tạo mới một role
 * @param {Object} fields
 * @returns {Reaction}
 */
exports.create = async fields => {
    return await ReactionModel.create(fields)
}

/**
 * Get role by id
 * @param {String} id
 * @returns {Reaction}
 */
exports.getById = async id => {
    return await ReactionModel.getById(id)
}

/**
 * Cập nhật thông tin role bởi id
 * @param {String} id
 * @param {Object} updatedFields new value of fields
 * @returns {Reaction}
 */
exports.updateById = async (id, updatedFields) => {
    return await ReactionModel.updateById(id, updatedFields)
}

/**
 * Xoa một role bởi id
 * @param {String} id
 * @returns {Reaction}
 */
exports.deleteById = async id => {
    return await ReactionModel.deleteById(id)
}

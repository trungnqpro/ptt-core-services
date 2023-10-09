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
 * Lấy danh sách tất cả các entity
 * @returns {Reaction}
 */
exports.fetch = async (skip = 0, limit = 20, filter, sort) => {
    const _filter = { ...filter }
    if (_filter.q) {
        const q = _filter.q.toLowerCase().trim()
        delete _filter.q
        _filter.$or = [{ name: { $regex: q, $options: 'i' } }]
    }

    const [reactions, total] = await Promise.all([
        ReactionModel.fetch(skip, limit, _filter, sort),
        ReactionModel.getTotalNumber(_filter),
    ])

    return { reactions, total }
}

/**
 * Tạo mới entity
 * @param {Object} fields
 * @returns {Reaction}
 */
exports.create = async fields => {
    return await ReactionModel.create(fields)
}

/**
 * Get entity by id
 * @param {String} id
 * @returns {Reaction}
 */
exports.getById = async id => {
    return await ReactionModel.getById(id)
}

/**
 * Cập nhật thông tin entity bởi id
 * @param {String} id
 * @param {Object} updatedFields new value of fields
 * @returns {Reaction}
 */
exports.updateById = async (id, updatedFields) => {
    return await ReactionModel.updateById(id, updatedFields)
}

/**
 * Xoa entity bởi id
 * @param {String} id
 * @returns {Reaction}
 */
exports.deleteById = async id => {
    return await ReactionModel.deleteById(id)
}

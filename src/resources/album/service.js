/**
 * @fileoverview Module xử lý nghiệp vụ cho phân quyền tài khoản (Album)
 *
 * @module resources/announcement/service
 */

const _ = require('lodash')
const { errors } = require('../../libs')
const AlbumModel = require('./model')
const permissionCodes = require('../../configs/permissions').permissionCodes

const { ValidationError } = errors

/**
 * Lấy danh sách tất cả các role
 * @returns {Album}
 */
exports.fetch = async (skip = 0, limit = 20, filter, sort) => {
    const _filter = { ...filter }
    if (_filter.q) {
        const q = _filter.q.toLowerCase().trim()
        delete _filter.q
        _filter.$or = [{ name: { $regex: q, $options: 'i' } }]
    }

    const [departments, total] = await Promise.all([
        AlbumModel.fetch(skip, limit, _filter, sort),
        AlbumModel.getTotalNumber(_filter),
    ])

    return { departments, total }
}

/**
 * Tạo mới một role
 * @param {Object} fields
 * @returns {Album}
 */
exports.create = async fields => {
    return await AlbumModel.create(fields)
}

/**
 * Get role by id
 * @param {String} id
 * @returns {Album}
 */
exports.getById = async id => {
    return await AlbumModel.getById(id)
}

/**
 * Cập nhật thông tin role bởi id
 * @param {String} id
 * @param {Object} updatedFields new value of fields
 * @returns {Album}
 */
exports.updateById = async (id, updatedFields) => {
    return await AlbumModel.updateById(id, updatedFields)
}

/**
 * Xoa một role bởi id
 * @param {String} id
 * @returns {Album}
 */
exports.deleteById = async id => {
    return await AlbumModel.deleteById(id)
}

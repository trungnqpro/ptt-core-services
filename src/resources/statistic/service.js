/**
 * @fileoverview Module xử lý nghiệp vụ cho phân quyền tài khoản (Artifact)
 *
 * @module resources/announcement/service
 */

const _ = require('lodash')
const { errors } = require('../../libs')
const ArtifactModel = require('./model')
const permissionCodes = require('../../configs/permissions').permissionCodes

const { ValidationError } = errors

/**
 * Lấy danh sách tất cả các entity
 * @returns {Artifact}
 */
exports.fetch = async (skip = 0, limit = 20, filter, sort) => {
    const _filter = { ...filter }
    if (_filter.q) {
        const q = _filter.q.toLowerCase().trim()
        delete _filter.q
        _filter.$or = [{ name: { $regex: q, $options: 'i' } }]
    }

    const [departments, total] = await Promise.all([
        ArtifactModel.fetch(skip, limit, _filter, sort),
        ArtifactModel.getTotalNumber(_filter),
    ])

    return { departments, total }
}

/**
 * Tạo mới entity
 * @param {Object} fields
 * @returns {Artifact}
 */
exports.create = async fields => {
    return await ArtifactModel.create(fields)
}

/**
 * Get entity by id
 * @param {String} id
 * @returns {Artifact}
 */
exports.getById = async id => {
    return await ArtifactModel.getById(id)
}

/**
 * Cập nhật thông tin entity bởi id
 * @param {String} id
 * @param {Object} updatedFields new value of fields
 * @returns {Artifact}
 */
exports.updateById = async (id, updatedFields) => {
    return await ArtifactModel.updateById(id, updatedFields)
}

/**
 * Xoa entity bởi id
 * @param {String} id
 * @returns {Artifact}
 */
exports.deleteById = async id => {
    return await ArtifactModel.deleteById(id)
}

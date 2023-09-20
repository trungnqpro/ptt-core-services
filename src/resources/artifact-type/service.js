/**
 * @fileoverview Module xử lý nghiệp vụ cho phân quyền tài khoản (ArtifactType)
 *
 * @module resources/announcement/service
 */

const _ = require('lodash')
const { errors } = require('../../libs')
const ArtifactTypeModel = require('./model')
const permissionCodes = require('../../configs/permissions').permissionCodes

const { ValidationError } = errors

/**
 * Lấy danh sách tất cả các entity
 * @returns {ArtifactType}
 */
exports.fetch = async (skip = 0, limit = 20, filter, sort) => {
    const _filter = { ...filter }
    if (_filter.q) {
        const q = _filter.q.toLowerCase().trim()
        delete _filter.q
        _filter.$or = [{ name: { $regex: q, $options: 'i' } }]
    }

    const [artifactTypes, total] = await Promise.all([
        ArtifactTypeModel.fetch(skip, limit, _filter, sort),
        ArtifactTypeModel.getTotalNumber(_filter),
    ])

    return { artifactTypes, total }
}

/**
 * Tạo mới entity
 * @param {Object} fields
 * @returns {ArtifactType}
 */
exports.create = async fields => {
    return await ArtifactTypeModel.create(fields)
}

/**
 * Get entity by id
 * @param {String} id
 * @returns {ArtifactType}
 */
exports.getById = async id => {
    return await ArtifactTypeModel.getById(id)
}

/**
 * Cập nhật thông tin entity bởi id
 * @param {String} id
 * @param {Object} updatedFields new value of fields
 * @returns {ArtifactType}
 */
exports.updateById = async (id, updatedFields) => {
    return await ArtifactTypeModel.updateById(id, updatedFields)
}

/**
 * Xoa entity bởi id
 * @param {String} id
 * @returns {ArtifactType}
 */
exports.deleteById = async id => {
    return await ArtifactTypeModel.deleteById(id)
}

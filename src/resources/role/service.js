/**
 * @fileoverview Module xử lý nghiệp vụ cho phân quyền tài khoản (Role)
 *
 * @module resources/announcement/service
 */

const _ = require('lodash')
const { errors } = require('../../libs')
const RoleModel = require('./model')
const permissionCodes = require('../../configs/permissions').permissionCodes

const { ValidationError } = errors

/**
 * Lấy danh sách tất cả các role
 * @returns {Role}
 */
exports.fetch = async () => {
    const roles = await RoleModel.fetch()

    return roles
}

/**
 * Tạo mới entity
 * @param {Object} fields
 * @returns {Role}
 */
exports.create = async fields => {
    if (fields.permissions) {
        const setPermissions = new Set(fields.permissions)
        const invalidPermissions = _.difference(fields.permissions, permissionCodes)
        invalidPermissions.forEach(permission => setPermissions.delete(permission))

        fields.permissions = Array.from(setPermissions)
    }

    const role = await RoleModel.create(fields)

    return role
}

/**
 * Get role by id
 * @param {String} id
 * @returns {Role}
 */
exports.getById = async id => {
    const role = await RoleModel.getById(id)

    return role
}

/**
 * Cập nhật thông tin role bởi id
 * @param {String} id
 * @param {Object} updatedFields new value of fields
 * @returns {Role}
 */
exports.updateById = async (id, updatedFields) => {
    // TODO: fix student role
    // only QTHT can update role
    if (id === process.env.ROLE_QTHT_ID && updatedFields?.permissions) {
        updatedFields?.permissions.push(
            'createUser',
            'updateUser',
            'viewDetailsOfUser',
            'deleteUser',
            'listUser',
            'setPasswordOfUser',
            'createRole',
            'updateRole',
            'viewDetailsOfRole',
            'deleteRole',
            'listRole',
            'createStudent',
            'updateStudent',
            'deleteStudent',
            'listStudent',
        )
    }

    if (updatedFields?.permissions?.length) {
        if (updatedFields.permissions) {
            const setPermissions = new Set(updatedFields.permissions)
            const invalidPermissions = _.difference(updatedFields.permissions, permissionCodes)
            invalidPermissions.forEach(permission => setPermissions.delete(permission))

            updatedFields.permissions = Array.from(setPermissions)
        }
    }

    const role = await RoleModel.updateById(id, updatedFields)

    return role
}

/**
 * Xoa entity bởi id
 * @param {String} id
 * @returns {Role}
 */
exports.deleteById = async id => {
    const { ROLE_QTHT_ID } = process.env
    if (![ROLE_QTHT_ID].includes(id)) {
        throw new ValidationError('Cannot delete role of system. Please contact administrator')
    }

    const result = await RoleModel.deleteById(id)
    return result
}

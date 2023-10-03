/**
 * @fileoverview Module xử lý nghiệp vụ cho phân quyền tài khoản (Role)
 *
 * @module resources/announcement/module
 */
const RoleSchema = require('./schema-mg')
const UserSchema = require('../user/schema-mg')
const { UPDATE_ROLE_CHANNEL } = require('./static').ROLE_CHANNEL
const publisher = require('../../connections/redis').getPublisher()
const debug = require('../../libs').Debug()

/**
 * Lấy danh sách các thông báo.
 * @returns {Array<Role>}
 */
exports.fetch = async () => {
    const roles = await RoleSchema.find().lean()
    return roles
}

/**
 * Tạo mới entity.
 *
 * @param {Object} entity Thông tin role.
 * @returns {Role}
 */
exports.create = async entity => {
    const result = await RoleSchema.create(entity)

    return result.toJSON()
}

/**
 * Lấy thông tin entity theo id.
 * @param {String} id Id role.
 * @returns role
 */
exports.getById = async id => {
    const role = await RoleSchema.findOne({ _id: id }).lean()
    return role
}

/**
 * Cập nhật thông tin role theo id.
 * @param {String} id Id role.
 * @param {Object} updatedFields Các giá trị mới.
 * @returns {Role} Thông tin mới của role sau khi cập nhật.
 */
exports.updateById = async (id, updatedFields) => {
    const role = await RoleSchema.findByIdAndUpdate(id, updatedFields, {
        new: true,
    }).lean()

    publisher
        .publish(UPDATE_ROLE_CHANNEL, JSON.stringify({ roleId: id }))
        .catch(error =>
            debug.error(
                `Cannot publish event update role to channel ${UPDATE_ROLE_CHANNEL}`,
                error,
            ),
        )

    return role
}

/**
 * Xóa entity theo id
 * @param {string} id Id role.
 * @returns {string} 'success'
 */
exports.deleteById = async id => {
    await UserSchema.updateMany({ roleId: id }, { roleId: null })

    const result = await RoleSchema.deleteOne({ _id: id })

    publisher
        .publish(UPDATE_ROLE_CHANNEL, JSON.stringify({ roleId: id }))
        .catch(error =>
            debug.error(
                `Cannot publish event update role to channel ${UPDATE_ROLE_CHANNEL}`,
                error,
            ),
        )

    return result
}

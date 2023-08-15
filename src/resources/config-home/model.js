/**
 * @fileoverview Module xử lý nghiệp vụ cho phân quyền tài khoản (Role)
 *
 * @module resources/announcement/module
 */
const ConfigHomeSchema = require('./schema-mg')
const debug = require('../../libs').Debug()

/**
 * Lấy danh sách theo tiêu chí truyền vào.
 * @param {number} [skip=0] Số lượng phần tử bỏ qua.
 * @param {number} [limit=20] Số lượng phần tử muốn lấy.
 * @param {Object} [filter={}] Các tiêu chí lọc.
 * @param {Object} [sort={}] Các tiêu chí sắp xếp.
 * @returns {Array<ConfigHome>} Mảng các tài khoản
 */

exports.fetch = async (skip = 0, limit = 20, filter = {}, sort = {}) => {
    // default sort desc
    if (!Object.keys(sort).length) {
        sort._id = -1
    }

    return await ConfigHomeSchema.find(filter).sort(sort).skip(skip).limit(limit).lean({ getters: true })
}

/**
 * Tạo mới một role.
 *
 * @param {Object} entity Thông tin role.
 * @returns {Role}
 */
exports.create = async role => {
    return await ConfigHomeSchema.create(role)
}

/**
 * Lấy thông tin một role theo id.
 * @param {String} id Id role.
 * @returns role
 */
exports.getById = async id => {
    return await ConfigHomeSchema.findOne({ _id: id }).lean()
}

/**
 * Cập nhật thông tin role theo id.
 * @param {String} id Id role.
 * @param {Object} updatedFields Các giá trị mới.
 * @returns {Role} Thông tin mới của role sau khi cập nhật.
 */
exports.updateById = async (id, updatedFields) => {
    return await ConfigHomeSchema.findByIdAndUpdate(id, updatedFields, {
        new: true,
    }).lean()
}

/**
 * Xóa một role theo id
 * @param {string} id Id role.
 * @returns {string} 'success'
 */
exports.deleteById = async id => {
    return await ConfigHomeSchema.deleteOne({ _id: id })
}

exports.getTotalNumber = async (filter = {}) => {
    return await ConfigHomeSchema.countDocuments(filter)
}

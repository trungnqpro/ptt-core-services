/**
 * @fileoverview Module xử lý nghiệp vụ cho phân quyền tài khoản (Role)
 *
 * @module resources/announcement/module
 */
const ObjectMoreSchema = require('./schema-mg')
const debug = require('../../libs').Debug()

/**
 * Lấy danh sách theo tiêu chí truyền vào.
 * @param {number} [skip=0] Số lượng phần tử bỏ qua.
 * @param {number} [limit=20] Số lượng phần tử muốn lấy.
 * @param {Object} [filter={}] Các tiêu chí lọc.
 * @param {Object} [sort={}] Các tiêu chí sắp xếp.
 * @returns {Array<ObjectMore>} Mảng các tài khoản
 */

exports.fetch = async (skip = 0, limit = 20, filter = {}, sort = {}) => {
    // default sort desc
    if (!Object.keys(sort).length) {
        sort._id = -1
    }

    return await ObjectMoreSchema.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean({ getters: true })
}

/**
 * Tạo mới entity.
 *
 * @param {Object} entity Thông tin entity.
 * @returns {Role}
 */
exports.create = async entity => {
    const result = await ObjectMoreSchema.create(entity)
    return result.toJSON()
}

/**
 * Lấy thông tin entity theo id.
 * @param {String} id Id entity.
 * @returns entity
 */
exports.getById = async id => {
    return await ObjectMoreSchema.findOne({ _id: id }).lean()
}

/**
 * Lấy thông tin entity theo sourceId.
 * @param {String} id Id entity.
 * @returns entity
 */
exports.getBySourceId = async id => {
    return await ObjectMoreSchema.find({ sourceId: id }).lean()
}

/**
 * Cập nhật thông tin entity theo id.
 * @param {String} id Id entity.
 * @param {Object} updatedFields Các giá trị mới.
 * @returns {Role} Thông tin mới của entity sau khi cập nhật.
 */
exports.updateById = async (id, updatedFields) => {
    return await ObjectMoreSchema.findByIdAndUpdate(id, updatedFields, {
        new: true,
    }).lean()
}

/**
 * Xóa entity theo id
 * @param {string} id Id entity.
 * @returns {string} 'success'
 */
exports.deleteById = async id => {
    return await ObjectMoreSchema.deleteOne({ _id: id })
}

exports.getTotalNumber = async (filter = {}) => {
    return await ObjectMoreSchema.countDocuments(filter)
}

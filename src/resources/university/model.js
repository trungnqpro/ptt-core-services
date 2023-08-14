/**
 * @fileoverview Module xử lý nghiệp vụ cho cấu hình nhóm điểm (university)
 *
 * @module resources/university/module
 */

const UniversitySchema = require('./schema-mg')

exports.fetch = async () => {
    const universities = await UniversitySchema.find({ isDeleted: false }).sort({ _id: 1 }).lean()

    return universities
}

/**
 * Tạo mới một trường đại học.
 *
 * @param {Object} entity Thông tin trường đại học.
 * @returns {PassPoint}
 */

exports.create = async entity => {
    let university = await UniversitySchema.create(entity)
    university = await university.populate({ path: 'pointGroupId' }).execPopulate()

    return university.toJSON()
}

/**
 * Cập nhật thông tin trường đại học theo id.
 * @param {String} id Id trường đại học.
 * @param {Object} updatedFields Các giá trị mới.
 * @returns {PassPoint} Thông tin mới của trường đại học sau khi cập nhật.
 */

exports.updateById = async (id, updatedFields) => {
    const university = await UniversitySchema.findOneAndUpdate({ _id: id }, updatedFields, {
        new: true,
    })
        .populate({ path: 'pointGroupId' })
        .lean({ getters: true })

    return university
}

/**
 * Xóa một trường đại học theo id
 * @param {string} id Id trường đại học.
 * @returns {string} 'success'
 */

exports.deleteById = async id => {
    await UniversitySchema.findOneAndUpdate({ _id: id }, { isDeleted: true })

    return 'success'
}

/**
 * Lấy thông tin một trường đại học theo id.
 *
 * Hàm này sẽ bỏ qua trường đại học đã bị xóa (isDeleted == true).
 *
 * @param {String} id Id trường đại học.
 * @returns {PassPoint}
 */

exports.getById = async id => {
    return UniversitySchema.findById(id).lean().populate({ path: 'pointGroupId' }).lean()
}

/**
 * Đếm tổng số trường đại học theo theo các tiêu chí lọc.
 * @param {Object} filter Các tiêu chí lọc.
 * @returns {number}
 */

exports.getTotalNumber = async (filter = {}) => {
    const total = await UniversitySchema.countDocuments(filter)

    return total
}

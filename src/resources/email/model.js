/**
 * @fileoverview Module xử lý nghiệp vụ cho cấu hình nhóm điểm (email)
 *
 * @module resources/email/module
 */

const EmailSchema = require('./schema-mg')

exports.fetch = async () => {
    const emails = await EmailSchema.find().sort({ _id: 1 }).lean()

    return emails
}

/**
 * Tạo mới và cập nhật một mẫu template.
 *
 * @param {Object} entity Thông tin cấu hình email.
 * @returns {EmailTemplate}
 */

exports.create = async entity => {
    const result = await EmailSchema.findOneAndUpdate(
        { type: entity.type },
        {
            description: entity.description,
            emailDeliveryTime: entity.emailDeliveryTime,
            title: entity.title,
        },
        { upsert: true, new: true },
    ).lean()

    return result
}

/**
 * Lấy thông tin một template email id.
 *
 * Hàm này sẽ bỏ qua cấu hình email đã bị xóa (isDeleted == true).
 *
 * @param {String} id Id cấu hình email.
 * @returns {EmailTemplate}
 */

exports.getById = async id => {
    return EmailSchema.findById(id).lean()
}

/**
 * Lấy thông tin một template email id.
 *
 * \).
 *
 * @param {String} id Id cấu hình email.
 * @returns {EmailTemplate}
 */

exports.getByType = async type => {
    return EmailSchema.findOne({ type: type }).lean()
}

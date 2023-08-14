/**
 * @fileoverview Service xử lý nghiệp vụ cho gửi email học viên lâu chưa đăng nhập lần đầu
 *
 * @module jobs/send-email-to-student-inactive
 */

const Email = require('../resources/email')
const debug = require('../libs/debug')()

/**
 * Nghiệp vụ xử lý theo từng ngày
 */
module.exports = async () => {
    await Email.Handle.sendEmailWarning()
}

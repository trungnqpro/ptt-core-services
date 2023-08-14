/**
 * @fileoverview Module load cấu hình hệ thống.
 * Các tham số cấu hình sẽ được tải lên trước khi hệ thống bắt đầu chạy.
 * Lưu ý về thứ tự cấu hình sẽ được load (không nên thay đổi thứ tự khi chưa tìm hiểu kĩ)
 *
 * @module configs
 */
const dotenv = require('dotenv')
const path = require('path')
const loadPermissions = require('./permissions').load

dotenv.config({
    path: path.join(__dirname, `../../env/${process.env.NODE_ENV}.env`),
})

dotenv.config({
    path: path.join(__dirname, '../../env/default.env'),
})

/**
 * Thực hiện load các cấu hình
 *
 * @async
 */
exports.load = async () => {
    await loadPermissions()
}

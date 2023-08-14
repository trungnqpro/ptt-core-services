/**
 * @fileoverview Module thực hiện khởi tạo các kết nối đến cơ sở dữ liệu/service khác.
 *
 * @module connections
 */
const Promise = require('bluebird')
const mongodb = require('./mongodb')
const redis = require('./redis')
const chalk = require('chalk')

const dbs = {
    mongodb,
    redis,
}

Object.keys(dbs).forEach(key => {
    exports[key] = dbs[key]
})

const { STARTING_TIMEOUT } = process.env
const WAITING_TIME = 1000 // ms

let timeCounting = 0

/**
 * Thực hiện khởi tạo và kiểm tra kết nối đến các cơ sở dữ liệu/service khác.
 * Sau một khoảng thời gian nhất định (cài đặt trong biến môi trường STARTING_TIMEOUT),
 * Nếu có một kết nối nào đó chưa thực hiện thành công thì sẽ trả về lỗi.
 *
 * @async
 * @returns {Boolean}
 */
exports.initConnections = async () => {
    if (timeCounting > STARTING_TIMEOUT) {
        console.log(chalk.red('Cannot connect to db'))
        throw new Error('Cannot start')
    }

    let isConnected = true
    await Promise.all(
        Object.keys(dbs).map(async dbName => {
            const isConnectedDB = await dbs[dbName].checkConnection()
            if (!isConnectedDB) {
                isConnected = false
                console.log(chalk.yellow('Waiting for connection to ' + dbName))
            }
            return false
        }),
    )
    if (!isConnected) {
        timeCounting += WAITING_TIME
        await Promise.delay(WAITING_TIME)
        return exports.initConnections()
    }
    return true
}

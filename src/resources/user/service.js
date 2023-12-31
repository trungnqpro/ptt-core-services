/**
 * @fileoverview Service xử lý nghiệp vụ cho tài khoản(user)
 *
 * @module resources/user/service
 */

const Promise = require('bluebird')
const _ = require('lodash')
const UserModel = require('./model')
const UserCache = require('./cache')
const UserSchema = require('./schema-mg')
const { hashPassword, verifyPassword } = require('../../libs/utils')
const { DataError, ValidationError, NotFoundError } = require('../../libs/errors')
const debug = require('../../libs/debug')()
const Static = require('./static')

/**
 * Lấy danh sách tài khoản theo tiêu chí truyền vào.
 * @param {number} [skip=0] Số lượng phần tử bỏ qua.
 * @param {number} [limit=20] Số lượng phần tử muốn lấy.
 * @param {Object} [filter={}] Các tiêu chí lọc.
 * @param {Object} [sort={}] Các tiêu chí sắp xếp.
 * @returns {Object} {users: Array<User>, total: Number} Mảng các tài khoản và tổng số trang
 */
exports.fetch = async (skip = 0, limit = 20, filter, sort) => {
    const _filter = { ...filter }
    if (_filter.q) {
        const q = _filter.q.toLowerCase().trim()
        delete _filter.q
        _filter.$or = [
            { username: { $regex: q, $options: 'i' } },
            { email: { $regex: q, $options: 'i' } },
            { firstName: { $regex: q, $options: 'i' } },
            { lastName: { $regex: q, $options: 'i' } },
            { phoneNumber: { $regex: q, $options: 'i' } },
            { code: { $regex: q, $options: 'i' } },
        ]
    }

    const [users, total] = await Promise.all([
        UserModel.fetch(skip, limit, _filter, sort),
        UserModel.getTotalNumber(_filter),
    ])

    return { users, total }
}

/**
 * Lấy danh sách tài khoản theo tiêu chí truyền vào.
 * @param {Object} [filter={}] Các tiêu chí lọc.
 * @param {Object} [sort={}] Các tiêu chí sắp xếp.
 * @returns {Object} {users: Array<User>, total: Number} Mảng các tài khoản
 */
exports.getAll = async (filter, sort) => {
    const users = await UserModel.getAll(filter, sort)

    return users
}

/**
 * Tìm kiếm user bởi tên tài khoản (username) hoặc email
 * @param {String} account account is username or email
 * @returns {User}
 */

exports.findByAccount = async account => {
    const user = await UserModel.findByAccount(account)

    return user
}

/**
 * Tạo mới một học viên.
 * Hàm này cũng sẽ xử lý tìm số code lớn nhất và tăng thêm 1 cho user mới
 * @param {Object} entity Thông tin học viên học.
 * @returns {User}
 */

exports.create = async fields => {
    let user = { ...fields, hashPassword: hashPassword(fields.password) }

    delete user.password
    // user.status = user.status || UserStatic.STATUS.PENDING

    // let result = await UserCache.lockInsert()
    // let retryNumber = 0

    // while (result || retryNumber > 10) {
    //     result = await UserCache.lockInsert()

    //     if (!result) {
    //         retryNumber += 1
    //         await Promise.delay(1000)
    //     }
    // }

    // if (retryNumber === 10) {
    //     throw new Error('Overtime! Lock inserting')
    // }

    // const maxCode = await UserCache.getMaxCode()
    // let code = '000000' + (parseInt(maxCode, 10) + 1)
    // code = code.slice(-6)
    // user.code = code

    user = await UserModel.create(user)
    // UserCache.unLockAndSetMaxCode(code).catch(error => debug.error(error))

    return user
}

/**
 * Tìm kiếm user theo id
 * @param {String} id
 * @returns {User}
 */

exports.getById = async id => {
    const user = await UserModel.getById(id)
    if (!user) {
        throw new NotFoundError(`Not Found user by id ${id}`)
    }

    return user
}

/**
 * Cập nhật thông tin user theo id
 * @param {String} id
 * @param {Object} updatedFields Giá trị mới của user
 * @returns {User}
 */

exports.updateById = async (id, updatedFields) => {
    if (updatedFields.city) {
        updatedFields.city = Static.CITY[updatedFields.city]
    }

    const user = await UserModel.updateById(id, updatedFields)

    if (!user) {
        throw new NotFoundError(`Not Found user by id ${id}`)
    }

    return user
}

/**
 * Xoá tài khoản user
 * Cập nhật isDeleted của fields là status = deleted
 * @param {*} id
 * @returns {String} Success
 */

exports.deleteById = async id => {
    const { DELETED } = Static.STATUS
    const user = await UserModel.getById(id)
    if (!user) {
        throw new NotFoundError(`Not found User id ${id}`)
    }
    if (user.status === DELETED) {
        throw new Error(`User id ${id} has been ${DELETED}`)
    }

    const updatedFields = {}
    updatedFields.email = `DeletedUser_${user.code}_${user.email || ''}`
    updatedFields.username = `DeletedUser_${user.code}_${user.username || ''}`
    updatedFields.status = DELETED

    const result = await UserModel.updateById(id, updatedFields)

    return result
}

/**
 * Nhận người dùng bằng tên người dùng hoặc email
 * @param {Object} identifier định danh là tên người dùng hoặc email
 * @returns {User}
 */

exports.getByUsernameOrEmail = async identifier => {
    const users = await UserModel.getByUsernameOrEmail(identifier)

    return users
}

/**
 * Cập nhật mật khẩu của user
 * @param {String} id
 * @param {Object} updatedFields Giá trị mới của user
 * @returns {User}
 */

exports.updatePasswordById = async (userId, password) => {
    const hashedPassword = hashPassword(password)
    const user = await UserModel.updateById(userId, {
        hashPassword: hashedPassword,
        isNewUser: false,
    })

    return user
}

/**
 * Nhận hồ sơ của người dùng bằng tên người dùng hoặc email. Hồ sơ sẽ chứa các quyền.
 * @param {string} identity danh tính là tên người dùng hoặc email
 * @returns thông tin người dùng
 */

exports.getProfileByIdentity = async identity => {
    const profiles = await UserModel.getProfileByIdentity(identity)

    if (profiles.length > 1) {
        throw new DataError(`There are more than one user has been registered by ${identity}`)
    }

    return profiles[0]
}

/**
 * Đổi mật khẩu của tài khoản (có xác thực mật khẩu)
 * @param {String} id
 * @param {Object} updatedFields Giá trị mới của tài khoản
 * @returns {User}
 */

exports.setMyPassword = async (id, password, currentPassword) => {
    const { DELETED } = Static.STATUS
    const user = await UserModel.getById(id)
    if (!user || user.status === DELETED) {
        return user
    }

    if (!verifyPassword(currentPassword, user.hashPassword)) {
        throw new ValidationError('Password is incorrect')
    }

    return exports.updatePasswordById(id, password)
}

/**
 * Lấy chuỗi đăng kí thông báo của tài khoản
 * @param {String} id
 * @param {Object} updatedFields Giá trị mới của user
 * @returns {User}
 */

exports.getNotiSubscriptionById = async userId => {
    const user = await UserModel.getById(userId)

    return user?.notiSubscriptionString
}

exports.setNotiSubscriptionById = async (userId, notiSubscriptionString) => {
    const user = await UserModel.updateById(userId, { notiSubscriptionString })
    UserCache.removeNotiSubscriptionById(userId)

    return user
}

/**
 * Tạo nhiều học viên
 * @param {Object} students
 * @returns {User}
 */
exports.batchCreate = async students => {
    let users = _.cloneDeep(students)
    users.forEach(user => {
        if (user.email) {
            user.email = user.email?.trim().replace(/ /g, '')
        }
        if (user.username) {
            user.username = user.username?.trim().replace(/ /g, '')
        }

        user.hashPassword = hashPassword(user.password)
        delete user.password
    })

    // validate
    const usernames = users.map(user => user.username)
    const emails = users.map(user => user.email)

    let result = await UserCache.lockInsert(60)
    let retryNumber = 0

    while (result) {
        result = await UserCache.lockInsert(60)

        if (!result) {
            retryNumber += 1
            await Promise.delay(1000)
        }

        if (retryNumber > 10) {
            throw new Error('Overtime! Lock inserting')
        }
    }

    let [hitUsernames, hitEmails] = await Promise.all([
        UserSchema.find({ username: { $in: usernames } }, { username: 1 }),
        UserSchema.find({ email: { $in: emails } }, { email: 1 }),
    ])

    hitUsernames = hitUsernames.map(user => user.username)
    hitEmails = hitEmails.map(user => user.email)

    let errorMessage = ''
    if (hitUsernames.length) {
        errorMessage += `Existed username: ${hitUsernames.join('; ')}`
    }
    if (hitEmails.length) {
        errorMessage += (errorMessage ? '\n' : '') + `Existed email: ${hitEmails.join(';')}`
    }

    if (errorMessage) {
        UserCache.unLockInsert().catch(error => debug.error(error))
        throw new ValidationError(errorMessage)
    }

    const maxCode = await UserCache.getMaxCode()
    let newMaxCode = '000000'
    for (let i = 0; i < users.length; i++) {
        const user = users[i]

        let code = '000000' + (parseInt(maxCode, 10) + i + 1)
        code = code.slice(-6)
        user.code = code
        newMaxCode = code
    }

    users = users.map(user => new UserSchema(user))

    await UserSchema.bulkWrite(
        users.map(user => ({
            insertOne: { document: user },
        })),
    )

    UserCache.unLockAndSetMaxCode(newMaxCode).catch(error => debug.error(error))

    return users
}

exports.getMyGuide = async userId => {
    const user = await UserModel.getById(userId)
    return user.guide
}

exports.setMyGuide = async (userId, newStatuses) => {
    const updatedFields = {}
    Object.keys(newStatuses).map(key => {
        updatedFields[`guide.${key}`] = newStatuses[key]
    })
    const user = await UserModel.updateById(userId, updatedFields)

    return user.guide
}

exports.updateDevice = async (userId, deviceId, userAgent) => {
    const user = await UserSchema.findById(userId)
    let isExisted = false

    if (!user.devices) {
        user.devices = []
    }

    for (const device of user.devices) {
        if (device.deviceId == deviceId) {
            device.lastLoggedIn = new Date()
            device.userAgent = userAgent
            isExisted = true
        }
    }

    if (!isExisted) {
        user.devices.push({
            deviceId,
            lastLoggedIn: new Date(),
            userAgent,
        })
    }

    await user.save()

    return _.cloneDeep(user.toJSON().devices)
}

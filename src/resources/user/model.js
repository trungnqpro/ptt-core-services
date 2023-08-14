/**
 * @fileoverview Module xử lý nghiệp vụ cho tài khoản(user)
 *
 * @module resources/user/module
 */

const UserSchema = require('./schema-mg')
const { DELETED, ACTIVE } = require('./static').STATUS
const { ConflictError } = require('../../libs/errors')
const moment = require('moment')
const UserEvent = require('./event')

/**
 * Lấy danh sách tài khoản theo tiêu chí truyền vào.
 * @param {number} [skip=0] Số lượng phần tử bỏ qua.
 * @param {number} [limit=20] Số lượng phần tử muốn lấy.
 * @param {Object} [filter={}] Các tiêu chí lọc.
 * @param {Object} [sort={}] Các tiêu chí sắp xếp.
 * @returns {Array<User>} Mảng các tài khoản
 */

exports.fetch = async (skip = 0, limit = 20, filter = {}, sort = {}) => {
    // default sort desc
    if (!Object.keys(sort).length) {
        sort._id = -1
    }

    const users = await UserSchema.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean({ getters: true })
    return users
}

/**
 * Lấy danh sách tài khoản theo tiêu chí truyền vào.
 * @param {Object} [filter={}] Các tiêu chí lọc.
 * @param {Object} [sort={}] Các tiêu chí sắp xếp.
 * @returns {Array<User>} Mảng các tài khoản
 */

exports.getAll = async (filter = {}, sort = {}) => {
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

    // default sort desc
    if (!Object.keys(sort).length) {
        sort._id = -1
    }

    const users = await UserSchema.find(_filter).sort(sort).lean({ getters: true })
    return users
}

/**
 * Tìm kiếm user bởi tên tài khoản (username) hoặc email
 * @param {String} account account is username or email
 * @returns {User}
 */

exports.findByAccount = async account => {
    const user = await UserSchema.find({ $or: [{ username: account }, { email: account }] }).lean()

    return user
}

/**
 * Tìm kiếm học viên bởi nhiều code user
 * hàm sẽ không trả về các user đã bị xoá hoặc user không phải là học viên
 * @param {Array<String>}  account account is username or email
 * @returns {User}
 */

exports.getListStudentByCodes = async studentsCode => {
    const users = await UserSchema.find({
        code: { $in: studentsCode },
        status: { $ne: DELETED },
        // roleId: studentRoleId,
    }).lean()

    return users
}

/**
 * Tạo mới một học viên.
 *
 * @param {Object} entity Thông tin học viên học.
 * @returns {User}
 */

exports.create = async user => {
    try {
        if (user.email) {
            user.email = user.email.replace(/ /g, '')
        }
        if (user.username) {
            user.username = user.username.replace(/ /g, '')
        }
        const result = await UserSchema.create(user)

        return result.toJSON()
    } catch (error) {
        handleError(error)
    }
}

/**
 * Tìm kiếm user theo id
 * @param {String} id
 * @returns {User}
 */
exports.getById = async id => {
    const user = await UserSchema.findOne({ _id: id }).lean({ getters: true })

    return user
}

/**
 * Tìm kiếm user theo nhiều id
 * @param {String} id
 * @returns {User}
 */

exports.getByIds = async (ids, includesDeleted = false) => {
    const conditions = { _id: { $in: ids } }
    if (!includesDeleted) {
        conditions.status = { $ne: DELETED }
    }

    const users = await UserSchema.find({ _id: { $in: ids } })
        .populate('roleId')
        .lean({ getters: true })

    return users
}

/**
 * Tìm kiếm user theo nhiều id
 * @param {String} id
 * @returns {User}
 */

exports.checkListUser = async Ids => {
    const findUsersByIds = await UserSchema.find().where('_id').in(Ids)

    var listUser = findUsersByIds.map(function (item) {
        return item._id
    })

    return listUser
}

/**
 * Cập nhật thông tin user theo id
 * @param {String} id
 * @param {Object} updatedFields Giá trị mới của user
 * @returns {User}
 */

exports.updateById = async (id, updatedFields) => {
    try {
        if (updatedFields.email) {
            updatedFields.email = updatedFields.email.replace(/ /g, '')
        }
        if (updatedFields.username) {
            updatedFields.username = updatedFields.username.replace(/ /g, '')
        }

        const user = await UserSchema.findByIdAndUpdate(id, updatedFields, {
            new: true,
        })
            .populate({ path: 'universityId' })
            .lean({ getters: true })
        UserEvent.update.emit(user._id)
        return user
    } catch (error) {
        handleError(error)
    }
}

/**
 * Đếm tổng số tài khoản theo theo các tiêu chí lọc.
 * @param {Object} filter Các tiêu chí lọc.
 * @returns {number}
 */

exports.getTotalNumber = async (filter = {}) => {
    const total = await UserSchema.countDocuments(filter)

    return total
}

/**
 * Nhận người dùng bằng tên người dùng hoặc email
 * @param {Object} identifier định danh là tên người dùng hoặc email
 * @returns {User}
 */

exports.getByUsernameOrEmail = async identifier => {
    const users = await UserSchema.find({
        $or: [
            {
                username: identifier,
            },
            {
                email: identifier,
            },
        ],
    }).lean({ getters: true })

    return users
}

/**
 * Nhận hồ sơ của người dùng bằng tên người dùng hoặc email. Hồ sơ sẽ chứa các quyền.
 * @param {string} identity danh tính là tên người dùng hoặc email
 * @returns thông tin người dùng
 */

exports.getProfileByIdentity = async identity => {
    const users = await UserSchema.find({
        $or: [
            {
                username: identity,
            },
            {
                email: identity,
            },
        ],
    })
        .populate('roleId')
        .lean({ getters: true })

    return users
}

function handleError(error) {
    if (error.codeName === 'DuplicateKey') {
        if (error.keyValue.username) {
            throw new ConflictError(`Username ${error.keyValue.username} already exists`)
        }
        if (error.keyValue.email) {
            throw new ConflictError(`Email ${error.keyValue.email} already exists`)
        }
    }
    throw error
}

/**
 * Tìm kiếm list user theo roleId
 * @param {String} roleId
 * @returns {User}
 */
exports.getByRoleId = async roleId => {
    const user = await UserSchema.find({ roleId, status: { $ne: DELETED } }).lean({ getters: true })

    return user
}

/**
 * Tìm kiếm list user inactivate theo id
 * @param {String} roleId
 * @returns {User}
 */
exports.getUserInactivateByDay = async day => {
    const startTime = moment().startOf('day').toDate()
    const endTime = moment().endOf('day').toDate()
    const user = await UserSchema.find({
        createdAt: { $gte: startTime, $lte: endTime },
        status: ACTIVE,
        isFirstLearning: true,
    }).lean({ getters: true })

    return user
}

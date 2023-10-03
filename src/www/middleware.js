/**
 * @fileoverview Middleware chứa các hàm kiểm tra thông tin request trước khi chuyển đến tầng xử lý nghiệp vụ.
 *
 * @module www/middleware
 */

const _ = require('lodash')
const { errors, utils } = require('../libs')
const { ValidationError, PermissionError, NotFoundError } = errors
const RoleCache = require('../resources').Role.Cache

const { ROLE_CBLT_ID, ROLE_QTHT_ID } = process.env
const debug = require('../libs/debug')()

/**
 * Validate tham số truyền vào api. Nếu không đúng với cấu hình sẽ trả về lỗi.
 * @param {Object} schemas Định nghĩa mô hình đối tượng cần validate
 * @param {funtion} [handleLogging] Hàm log lỗi
 */
exports.validateApiSchema = (schemas, handleLogging) => {
    if (!schemas) {
        throw new Error('Schema of api is not defined')
    }

    return (ctx, next) => {
        const { body } = ctx.request
        const { params, query } = ctx

        const data = {
            body,
            params,
            query,
        }

        const positions = Object.keys(schemas) // [body, params, query]
        if (schemas.headers) {
            data.headers = _.pick(ctx.request.headers, Object.keys(schemas.headers))
        }

        for (let i = 0; i < positions.length; i += 1) {
            const part = positions[i]
            const schema = typeof schemas[part] === 'function' ? schemas[part](ctx) : schemas[part]
            const partSchema = data[part]
            if (part === 'params') {
                delete partSchema['0']
            }
            const { error } = schema.validate(partSchema)
            const details = !error || error.details

            if (error) {
                if (handleLogging) {
                    handleLogging(error, ctx)
                }

                throw new ValidationError(`Missing or invalid params at ${part}`, null, details)
            }
        }

        return next()
    }
}

/**
 * Chặn log trong một số trường hợp cần bảo vệ nội dung dữ liệu.
 * @param {Object} ctx koa ctx
 * @param {Function} next koa next function
 */
exports.preventLog = (ctx, next) => {
    ctx.state.preventLog = true
    return next()
}

/**
 * Bật cờ thông báo xử lý trả về data theo nghiệp vụ và không thực hiện format lại.
 * @param {Object} ctx koa ctx
 * @param {Function} next koa next function
 */
exports.useOriginalResponse = (ctx, next) => {
    ctx.state.originalResponse = true
    return next()
}

/**
 * Kiểm tra tính hợp lệ của access token
 * @param {Object} ctx koa ctx
 * @param {Function} next koa next function
 */
exports.validateAccessToken = async function (ctx, next) {
    const authorization = ctx.request.headers['authorization']

    const payload = utils.decodeToken(authorization)

    ctx.state.user = payload

    return next()
}

/**
 * Kiểm tra người dùng có quyền thực hiện một hành động trên một tài nguyên nào đó không.
 * @param {String | Object} permission exp: 'createUser' or {or: ['createUser', 'updateUser']}
 */
exports.checkPermission = permission => async (ctx, next) => {
    debug.info('[checkPermission]', permission)
    if (!permission) {
        throw new Error('Permission must be not null')
    }

    const roleId = ctx.state?.user?.roleId
    const role = roleId ? await RoleCache.getById(roleId) : {}

    const permissions = role?.permissions || []

    let isGranted = false

    if (typeof permission === 'string') {
        isGranted = permissions?.includes(permission)
    } else if (typeof permission === 'function') {
        isGranted = await Promise.resolve(ctx, permission(permissions))
    } else if (typeof permission === 'object') {
        // priority of $and higher $or
        if (permission.and) {
            isGranted = await andPermissions(ctx, permissions, permission.and)
        } else if (permission.or) {
            isGranted = await orPermissions(ctx, permissions, permission.or)
        }
    }


    if (!isGranted) {
        debug.error(`Not allow at roleId ${roleId?.id || role?.id} with permission ${permission}`)
        throw new PermissionError("You don't have permission to perform this action")
    }

    return next()
}

/**
 * Chỉ cho phép QTHT thực hiện truy cập api
 * @param {Object} ctx koa ctx
 * @param {Function} next koa next function
 */
exports.onlyAllowQtht = (ctx, next) => {
    const roleId = ctx.state?.user?.roleId
    if (roleId === ROLE_QTHT_ID) {
        return next()
    }

    throw new PermissionError('Only QTHT have permission to perform this action')
}

/**
 * Chỉ cho phép CBLT thực hiện truy cập api
 * @param {Object} ctx koa ctx
 * @param {Function} next koa next function
 */
exports.onlyAllowCblt = (ctx, next) => {
    const roleId = ctx.state?.user?.roleId
    if (roleId === ROLE_CBLT_ID) {
        return next()
    }

    throw new PermissionError('Only CBLT have permission to perform this action')
}

/**
 * Chỉ cho phép CBLT thực hiện truy cập api
 * @param {Object} ctx koa ctx
 * @param {Function} next koa next function
 */
exports.onlyAllowCbltAndQtht = (ctx, next) => {
    const roleId = ctx.state?.user?.roleId
    if ([ROLE_CBLT_ID, ROLE_QTHT_ID].includes(roleId)) {
        return next()
    }

    throw new PermissionError('Only CBLT and QTHT have permission to perform this action')
}

/**
 * Không cho phép guest thực thiện api.
 * @param {Object} ctx koa ctx
 * @param {Function} next koa next function
 */
exports.notAllowGuest = (ctx, next) => {
    const roleId = ctx.state?.user?.roleId
    if (!roleId) {
        throw new PermissionError("Guest haven't permission to perform this action")
    }

    return next()
}

exports.checkAvailable = (resourceName, parameterName, getResourceById, checkFunc) => async (
    ctx,
    next,
) => {
    const resourceId = ctx.params[parameterName]
    const resource = await Promise.resolve(getResourceById(resourceId))

    if (checkFunc(resource, ctx)) {
        return next()
    } else {
        throw new NotFoundError(`Not found ${resourceName} ${resourceId}`)
    }
}

async function orPermissions(ctx, myPermissions, requiredPermissions) {
    if (!Array.isArray(requiredPermissions)) {
        throw new Error('"or" permissions must be an array')
    }

    const isOk = false

    for (const permission of requiredPermissions) {
        if (typeof permission === 'string') {
            if (myPermissions.includes(permission)) {
                return true
            }
        } else if (typeof permission === 'function') {
            const result = await Promise.resolve(permission(ctx, myPermissions))
            if (result) {
                return true
            }
        } else if (typeof permission === 'object') {
            if (permission.or && (await orPermissions(ctx, myPermissions, permission.or))) {
                return true
            }
            if (permission.and && (await andPermissions(ctx, myPermissions, permission.and))) {
                return true
            }
        } else {
            throw new Error('"or" permissions only contains string or object')
        }
    }

    return isOk
}

async function andPermissions(ctx, myPermissions, requiredPermissions) {
    if (!Array.isArray(requiredPermissions)) {
        throw new Error('"and" permissions must be an array')
    }

    const isOk = true

    for (const permission of requiredPermissions) {
        if (typeof permission === 'string') {
            if (!myPermissions.includes(permission)) {
                return false
            }
        } else if (typeof permission === 'function') {
            const result = await Promise.resolve(permission(ctx, myPermissions))
            if (!result) {
                return false
            }
        } else if (typeof permission === 'object') {
            if (permission.or && !(await orPermissions(ctx, myPermissions, permission.or))) {
                return false
            }
            if (permission.and && !(await andPermissions(ctx, myPermissions, permission.and))) {
                return false
            }
        } else {
            throw new Error('"and" permissions only contains string or object')
        }
    }

    return isOk
}

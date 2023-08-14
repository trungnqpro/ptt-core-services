/**
 * @fileoverview Service xử lý caching user.
 *
 * @module resources/user/service
 */

const Redis = require('../../connections/redis')
const UserSchema = require('./schema-mg')
const debug = require('../../libs/debug')()
const UserEvent = require('./event')

const redis = Redis.getConnection()

// const genKeyById = id => Redis.genKey('users', `id:${id}`)
const genKeyNotiSubscriptionById = id => Redis.genKey('noti-subscription/users', id)
const genKeyById = id => Redis.genKey('users', id)
const keyLockInsert = Redis.genKey('user', 'lock-insert')
const keyMaxCode = Redis.genKey('user', 'max-code')

exports.getById = async id => {
    const key = genKeyById(id)
    const user = await Redis.cachedFn(redis, { key, json: true, ttl: '10m' }, async () => {
        const user = await UserSchema.findById(id).lean({ getters: true })

        return user
    })

    return user
}

exports.removeById = async id => {
    const key = genKeyById(id)

    return redis.del(key).catch(error => {
        debug.error(`Cannot delete cache of user ${id}`, error)
    })
}

UserEvent.update.listen(userId => {
    exports.removeById(userId)
})

UserEvent.delete.listen(userId => {
    exports.removeById(userId)
})

exports.getNotiSubscriptionById = async id => {
    const key = genKeyNotiSubscriptionById(id)
    const subscription = await Redis.cachedFn(redis, { key, json: false, ttl: '10m' }, async () => {
        const user = await UserSchema.findById(id)

        return user?.notiSubscriptionString
    })

    return subscription ? JSON.parse(subscription) : subscription
}

exports.removeNotiSubscriptionById = async id => {
    const key = genKeyNotiSubscriptionById(id)

    return redis.del(key).catch(error => {
        debug.error(`Cannot delete noti subscription by user id ${id}`, error)
    })
}

/**
 * Step 1 in inserting user
 */
exports.lockInsert = async (ttlInSecond = 10) => {
    return redis.setLock(keyLockInsert, new Date().getTime() + 10000, ttlInSecond).catch(error => {
        debug.error('Cannot lock insert user', error)
        throw new Error('Cannot lock insert user')
    })
}

exports.unLockInsert = async () => {
    return redis.del(keyLockInsert).catch(error => {
        debug.error('Cannot unlock insert user', error)
        throw new Error('Cannot unlock insert user')
    })
}

/**
 * Step 3 in inserting user
 * @param {String} code user code (format: '012345')
 */
exports.unLockAndSetMaxCode = async code => {
    return redis.unLockAndSet(keyLockInsert, keyMaxCode, code, 1800).catch(error => {
        debug.error('Cannot lock insert user', error)
        throw new Error('Cannot lock insert user')
    })
}

/**
 * Step 2 in inserting user
 */
exports.getMaxCode = async () => {
    const code = await Redis.cachedFn(
        redis,
        { key: keyMaxCode, json: false, ttl: '1800s' },
        async () => {
            const user = await UserSchema.find().sort({ code: -1 }).limit(1)

            return user[0]?.code || '000000'
        },
    )

    return code
}

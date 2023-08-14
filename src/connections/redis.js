/**
 * @fileoverview Module thực hiện khởi tạo các kết nối đến cơ sở dữ liệu Redis.
 * Và khai báo một số hàm mở rộng.
 *
 * @module connections/redis
 */
const Redis = require('ioredis')
const ms = require('ms')
const zlib = require('zlib')
const chalk = require('chalk')
const debug = require('../libs/debug')()

const { env } = process
const { REDIS_PREFIX: prefix } = env

/**
 * Hàm tạo key theo format để sử dụng trong cluster
 *
 * @function genKey
 * @static
 *
 * @returns Redis connection
 */
const genKey = (cluster_key, primary_key) => `{${prefix}/${cluster_key}}:${primary_key}`

/**
 * Thiết lập kết nối mới đến csdl Redis
 *
 * @function getNewConnection
 * @async
 * @static
 *
 * @returns Redis connection
 */
const getNewConnection = () => {
    console.log(chalk.yellow('Connecting to Redis...'))
    const node = {
        port: env.REDIS_PORT || 6379,
        host: env.REDIS_HOST || 'localhost',
    }

    const options = {
        password: env.REDIS_PASSWORD,
    }

    const nodes = [node]
    if (env.REDIS_NODE_1_HOST && env.REDIS_NODE_1_PORT) {
        nodes.push({
            host: env.REDIS_NODE_1_HOST,
            port: env.REDIS_NODE_1_PORT,
        })
    }
    if (env.REDIS_NODE_2_HOST && env.REDIS_NODE_2_PORT) {
        nodes.push({
            host: env.REDIS_NODE_2_HOST,
            port: env.REDIS_NODE_2_PORT,
        })
    }

    if (env.REDIS_MODE === 'cluster') {
        return new Redis.Cluster(nodes, { redisOptions: options })
    }

    if (env.REDIS_MODE === 'sentinel') {
        return new Redis({
            sentinels: [node],
            name: env.REDIS_SENTINEL_NAME,
            sentinelPassword: env.REDIS_SENTINEL_PASSWORD,
            password: env.REDIS_PASSWORD,
            db: env.REDIS_DB,
        })
    }

    // default
    options.db = env.REDIS_DB

    return new Redis(node.port, node.host, options)
}

const redis = getNewConnection()
const publisher = getNewConnection()
const subscriber = getNewConnection()

/**
 * Thực hiện caching kết quả của một function.
 *
 * @function cachedFn
 * @async
 * @static
 *
 * @param {object} options Tùy chọn cài đặt {key: "cache key", ttl: time_in_second, json: is_json}.
 * @param {String} options.key Key of the cache.
 * @param {Number|String} [options.ttl=60] Thời gian sống của record.
 * @param {Boolean} [options.json=false] Truyền vào true nếu giá trị được lưu có kiểu Json.
 * @param {Boolean} [options.compress=false] Cờ xác định có thực hiện nén không.
 * @param {function} fn Hàm sẽ được thực hiện nếu không tìm thấy cache.
 * @return {Boolean|String} Nếu json = true thì thực hiện parse sang Json trước khi return,
 * nếu không thì trả về kết quả kiểu String.
 */
const cachedFn = async (rclient, { key, ttl = 60, json = false, compress = false }, fn) => {
    if (!key) {
        throw new Error('key is required')
    }

    if (!(typeof ttl === 'number') && !(typeof ttl === 'string')) {
        throw new TypeError(`expecting ttl to be number (second) or string, got ${typeof ttl}`)
    }

    let ttlInSecond = ttl
    if (typeof ttl === 'string') {
        ttlInSecond = ms(ttl) / 1000
    }

    let cached = await rclient.get(key)
    if (!cached) {
        const result = await fn()
        if (!result) {
            return result
        }

        let val = json ? JSON.stringify(result) : result
        if (compress) {
            val = zlib.gzipSync(val).toString('base64')
        }
        rclient.set(key, val, 'EX', ttlInSecond)

        return result
    }

    if (compress) {
        cached = zlib.gunzipSync(Buffer.from(cached, 'base64')).toString('utf8')
    }
    if (json) {
        cached = JSON.parse(cached)
    }

    return cached
}

/**
 * set lock
 * 1: key
 * 2: value
 * 3: expiry (in seconds)
 */
redis.defineCommand('setLock', {
    numberOfKeys: 0,
    lua: `
        local key = ARGV[1]
        local value = ARGV[2]
        local expiry = ARGV[3]
        local reply = redis.call("SETNX", key, value)
        if 1 == reply then 
            redis.call("EXPIRE", key, expiry) 
        end
        return reply
    `,
})

/**
 * unlock and set key - value
 * 1: key
 * 2: value
 * 3: expiry (in seconds)
 */
redis.defineCommand('unLockAndSet', {
    numberOfKeys: 0,
    lua: `
        local keyLock = ARGV[1]
        local key = ARGV[2]
        local value = ARGV[3]
        local expiry = ARGV[4]

        local reply = redis.call("SET", key, value, "EX", expiry)
        local reply = redis.call("DEL", keyLock)

        return reply
    `,
})

redis.on('connect', () => {
    console.log(chalk.blue('Connected to Redis'))
})

redis.on('reconnecting', () => {
    debug.log(chalk.blue('Connected to Redis'))
})

redis.on('error', error => {
    debug.error('Occurs error on redis', error)
})

/**
 * Kiểm tra kết nối đến mongodb đã thành công hay chưa.
 * @function checkConnection
 * @async
 * @return {Boolean}
 */
const checkConnection = () =>
    Promise.resolve(redis.status)
        .then(result =>
            result === 'ready' ? { connected: true } : { connected: false, error: result },
        )
        .catch(error => ({ connected: false, error: error.message }))

module.exports = {
    getConnection: () => redis,
    /**
     * Lấy kết nối dạng publisher.
     * @function getPublisher
     * @return Redis connection
     */
    getPublisher: () => publisher,
    /**
     * Lấy kết nối dạng subscriber.
     * @function getSubscriber
     * @return Redis connection
     */
    getSubscriber: () => subscriber,
    getNewConnection,
    genKey,
    cachedFn,
    checkConnection,
}

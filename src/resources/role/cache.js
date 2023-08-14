const NodeCache = require('node-cache')
const chalk = require('chalk')

const { redis: Redis } = require('../../connections')
const RoleModel = require('./model')
const { UPDATE_ROLE_CHANNEL } = require('./static').ROLE_CHANNEL

// const redis = Redis.getConnection()

const MEMORY_CACHE_TTL = 10 * 60 // 10 minute
// const RD_TTL = '10m' // 10 minutes

const memoryCache = new NodeCache({
    stdTTL: MEMORY_CACHE_TTL,
    checkperiod: 60,
    useClones: true, // able multi keys refers to a object (not clone)
})

// const genKeyById = id => Redis.genKey('roles', `id:${id}`)

exports.getById = async id => {
    const memoryCacheKey = `full:id:${id}`
    let role = memoryCache.get(memoryCacheKey)

    if (!role) {
        role = await RoleModel.getById(id)
        memoryCache.set(memoryCacheKey, role)
    }

    return role
}

const subscriber = Redis.getSubscriber()

subscriber.subscribe(UPDATE_ROLE_CHANNEL, err => {
    if (err) {
        console.error(
            chalk.red(`Cannot subscriber ${UPDATE_ROLE_CHANNEL}`),
            err,
        )
        process.exit(1)
    }
})

subscriber.on('message', async (channel, message) => {
    if (channel !== UPDATE_ROLE_CHANNEL) {
        return
    }

    const { roleId } = JSON.parse(message)
    memoryCache.del(`full:id:${roleId}`)
})

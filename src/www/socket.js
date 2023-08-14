const socketIo = require('socket.io')
const _ = require('lodash')
const redis_adapter = require('socket.io-redis')
const debug = require('../libs/debug')()
const { registerSender } = require('../resources/notification/service')
const chatListener = require('../routes/chat/socket-listener')
const Redis = require('../connections/redis')
const { UnknownError, AuthenticationError } = require('../libs/errors')
const { decodeToken } = require('../libs/utils')
const publisher = Redis.getPublisher()

const CRITICAL_ERROR_EVENT = 'socket-client'

exports.create = server => {
    const options = {
        path: process.env.SOCKET_PATH,
        allowEIO3: true,
    }

    if (process.env.CORS_ORIGIN) {
        options.cors = {
            origin: process.env.CORS_ORIGIN,
            methods: ['GET', 'POST'],
        }
    }

    const io = socketIo(server, options)

    io.adapter(
        redis_adapter({
            pubClient: Redis.getNewConnection(),
            subClient: Redis.getNewConnection(),
        }),
    )

    registerSender(io)
    preventLoginMultiDevices(io)
    listenEventsFromOtherNode(io)

    io.use(checkInSession) // always execute before authentication middleware
    io.use(verifyToken)

    io.on('connection', async socket => {
        const { user } = socket.state
        debug.log('a client connected')

        socket.join(user.id.toString())

        if (!socket.state.disconnected) {
            preventStudentOnlineOnMultipleDevices(io, socket)
        }

        chatListener(socket, io)
    })

    io.on('error', error => {
        debug.error(error)
    })
}

const verifyToken = async (socket, next) => {
    // Authorize
    const { token } = socket.handshake.query

    let ok = true
    let error = new UnknownError('Unknow error')
    if (!verifyToken) {
        error = new AuthenticationError('verifyToken is required')
        ok = false
    }

    if (!ok) {
        debug.warn(error)
        socket.emit(CRITICAL_ERROR_EVENT, { error })
        socket.disconnect()

        return false
    }

    if (!ok) {
        debug.warn(error)
        socket.emit(CRITICAL_ERROR_EVENT, error)
        socket.disconnect()

        return false
    }

    socket.state = socket.state || {}

    try {
        socket.state.user = decodeToken('Bearer ' + token)
        socket.state.connectedAt = new Date()
    } catch (error) {
        debug.warn(error.message)
        return socket.disconnect()
    }

    socket.join(socket.state.user.id)

    return next()
}

const preventStudentOnlineOnMultipleDevices = async (io, socket) => {
    if (socket.state?.user?.roleId !== process.env.ROLE_STUDENT_ID) {
        return
    }

    // get clients in room
    const userId = socket.state.user.id.toString()
    let clientIds = await socket.in(userId).allSockets()
    clientIds = Array.from(clientIds)
    const states = await getSocketStates(clientIds)

    debug.info(`Student ${socket.state.user.id} online on ${clientIds.length} device ${clientIds}`)

    states.sort((a, b) => (a.state.user.loggedAt > b.state.user.loggedAt ? -1 : 1))
    states.reverse()

    const groupByDeviceId = _.groupBy(states, e => e.state.user.deviceId)
    let deviceIds = Object.keys(groupByDeviceId)

    deviceIds.forEach(deviceId => {
        groupByDeviceId[deviceId].sort((a, b) =>
            a.state.user.loggedAt > b.state.user.loggedAt ? 1 : -1,
        ) // asc
    })
    deviceIds.sort((a, b) =>
        groupByDeviceId[a][0].state.user.loggedAt > groupByDeviceId[b][0].state.user.loggedAt
            ? 1
            : -1,
    ) // asc
    deviceIds.reverse() // desc

    debug.info('Devices', deviceIds)
    const ableDevices = deviceIds.splice(0, 2) // keep 2 newest devices
    const kickedDevices = deviceIds
    deviceIds = ableDevices

    publisher.publish(
        'kick-of-devices',
        JSON.stringify({
            userId,
            deviceIds: kickedDevices,
            lastDeviceId: socket.state.user.deviceId,
        }),
    )
}

const checkInSession = async (socket, next) => {
    socket.on('disconnect', async reason => {
        debug.log(`disconnectd by reason: ${reason}`)
    })

    socket.on('disconnecting', async reason => {
        debug.log(`disconnecting with reason: ${reason}`)
    })

    socket.on('error', error => {
        debug.error('socket error', error)
    })

    return next()
}

async function preventLoginMultiDevices(io) {
    Redis.getSubscriber().subscribe('kick-of-devices', error => {
        if (error) {
            debug.error('Cannot subscribe to kick-of-devices', error)
        }
    })

    Redis.getSubscriber().on('message', (channel, message) => {
        if (channel !== 'kick-of-devices') {
            return
        }

        let userId, deviceIds, lastDeviceId
        try {
            const payload = JSON.parse(message)
            userId = payload.userId
            deviceIds = payload.deviceIds
            lastDeviceId = payload.lastDeviceId
            if (!userId || !deviceIds?.length) {
                return
            }
        } catch (error) {
            return
        }

        const privateRoom = io.sockets.adapter.rooms.get(userId)
        if (!privateRoom) {
            return
        }
        const clientIds = Array.from(privateRoom.values())
        const userSockets = clientIds
            .map(clientId => io.sockets.sockets.get(clientId))
            .filter(e => !!e && !e.state.disconnected)

        userSockets.forEach(clientSocket => {
            if (deviceIds.includes(clientSocket.state.user.deviceId)) {
                clientSocket.state.disconnected = true
                clientSocket.emit('message', {
                    code: 'force-logout',
                    message: 'You has login on other device/browser',
                    lastDeviceId,
                    yourDeviceId: clientSocket.state.user.deviceId,
                })
                clientSocket.leave(userId)
                clientSocket.disconnect()
            }
        })
    })
}

async function listenEventsFromOtherNode(io) {
    Redis.getSubscriber().subscribe('get-state-socket-by-sid', error => {
        if (error) {
            debug.error('Occurs error while subscribe get-state-socket-by-sid', error)
        }
    })

    Redis.getSubscriber().on('message', (channel, message) => {
        if (channel === 'get-state-socket-by-sid') {
            const clientId = message
            const socket = io.sockets.sockets.get(clientId)

            if (socket) {
                Redis.getPublisher().publish(
                    'socket.state.' + clientId,
                    JSON.stringify(socket.state),
                )
            }
        }
    })
}

async function getSocketStates(clientIds) {
    const getStates = []
    for (let i = 0; i < clientIds.length; i++) {
        getStates.push(
            new Promise((resolve, reject) => {
                const clientId = clientIds[i]
                Redis.getPublisher().publish('get-state-socket-by-sid', clientId)
                Redis.getSubscriber().subscribe('socket.state.' + clientId, error => {
                    if (error) {
                        debug.error('Occurs error while subscribe get-state-socket-by-sid', error)
                        reject(error)
                    }
                })

                Redis.getSubscriber().on('message', (channel, message) => {
                    if (channel === 'socket.state.' + clientId) {
                        const state = JSON.parse(message)
                        resolve(state)
                        Redis.getSubscriber().unsubscribe('socket.state.' + clientId)
                    }
                })

                setTimeout(() => {
                    resolve(null)
                }, 200)
            }),
        )
    }

    const states = await Promise.all(getStates)

    return clientIds.map((clientId, i) => ({
        socketId: clientId,
        state: states[i],
    }))
}

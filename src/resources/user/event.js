const events = require('events')
const EVENTS = {
    ADD: 'add',
    UPDATE: 'update',
    DELETE: 'delete',
}

const event = new events.EventEmitter()

exports.EVENTS = EVENTS

exports.add = {
    listen: handler => event.on(EVENTS.ADD, handler),
    emit: userId => {
        event.emit(EVENTS.ADD, userId)
    },
}

exports.update = {
    listen: handler => event.on(EVENTS.UPDATE, handler),
    emit: userId => {
        event.emit(EVENTS.UPDATE, userId)
    },
}

exports.delete = {
    listen: handler => event.on(EVENTS.DELETE, handler),
    emit: userId => {
        event.emit(EVENTS.DELETE, userId)
    },
}

/**
 * @fileoverview Module hỗ trợ debug, sử dụng thay cho console.
 *
 * @module libs/debug
 */
/* eslint-disable func-names */
const debug = require('debug')('app')
const path = require('path')
const StackTrace = require('stacktrace-js')

const logger = require('./logger')

/**
 * Thực hiện ghi log ra màn hình hoặc/và file
 *
 * @param {String} level log level.
 * @param {String} namespace debug namespace.
 * @param  {...any} args Các tham số khác muốn logs.
 */
function print(level, namespace, ...args) {
    const { lineNumber, columnNumber, functionName } = StackTrace.getSync()[2]
    const fn = functionName === 'NativeConnection.<anonymous>' ? '' : `#${functionName}`
    const writer = debug.extend(level).extend(`/${namespace}${fn}:${lineNumber}:${columnNumber}`)

    writer(...args)
    const _args = args.map(e => (typeof e === 'string' ? e.replace(/%/g, '`0|0') : e))
    Promise.resolve(logger.log(level === 'log' ? 'info' : level, ..._args)).catch(error =>
        console.error('Cannot write log to file', error),
    )
}

/**
 * Init debug instance
 *
 * @constructor
 */
function Debug() {
    const stackLine = StackTrace.getSync()[2]
    const pathFile = stackLine.fileName
    const dirname = path.dirname(pathFile)
    const filename = path.basename(pathFile, '.js')
    const absolute = path.relative(path.join(__dirname, '..'), dirname)
    const arrDir = absolute ? absolute.split(path.sep) : []
    arrDir.push(filename)
    const namespace = arrDir.join('/')

    this._namespace = `${namespace}`
    return this
}

/**
 * Lấy thông tin namespace
 *
 * @returns {String} namespace
 */
Debug.prototype.getNamespace = function () {
    return this._namespace
}

/**
 * Set sub namespace
 *
 * @param {String} sub sub namespace
 *
 * @returns {Debug} this debug object
 */
Debug.prototype.setSubNamespace = function (sub) {
    this._namespace = `${this._namespace}/${sub}`

    return this
}

/**
 * Debug as log level
 *
 * @param  {...any} args Các tham số muốn logs.
 *
 * @returns {Debug} this debug object
 */
Debug.prototype.log = function (...args) {
    print('log', this._namespace, ...args)
}

/**
 * Debug as info level
 *
 * @param  {...any} args Các tham số muốn logs.
 *
 * @returns {Debug} this debug object
 */
Debug.prototype.info = function (...args) {
    print('info', this._namespace, ...args)
}

/**
 * Debug as warn level
 *
 * @param  {...any} args Các tham số muốn logs.
 *
 * @returns {Debug} this debug object
 */
Debug.prototype.warn = function (...args) {
    print('warn', this._namespace, ...args)
}

/**
 * Debug as error level
 *
 * @param  {...any} args Các tham số muốn logs.
 *
 * @returns {Debug} this debug object
 */
Debug.prototype.error = function (...args) {
    print('error', this._namespace, ...args)
}

/**
 * Debug as critical level
 *
 * @param  {...any} args Các tham số muốn logs.
 *
 * @returns {Debug} this debug object
 */
Debug.prototype.critical = function (...args) {
    print('critical', this._namespace, ...args)
}

module.exports = () => new Debug()

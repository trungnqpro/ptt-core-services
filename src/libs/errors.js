/**
 * @fileoverview Các loại lỗi.
 *
 * @namespace errors
 */

/**
 * @classDesc Định nghĩa các lỗi đến từ (do) phía client.
 * @memberof errors
 * @class
 */
class ClientError extends Error {
    constructor(message) {
        super(message)
    }
}

/**
 * @classDesc Định nghĩa các lỗi đến từ (do) phía server.
 * @memberof errors
 * @class
 */
class ServerError extends Error {
    constructor(message, code) {
        super(message)
        this.code = code || 500
        this.type = ServerError
    }
}

/**
 * @classDesc Định nghĩa các lỗi đến từ (do) phía dịch vụ bên thứ 3.
 * @memberof errors
 * @class
 */
class ThirdSystemError extends ServerError {
    constructor(message, code) {
        super(message, code)
        this.type = ThirdSystemError
    }
}

/**
 * @classDesc Định nghĩa các lỗi do sai định dạng/có giá trị không đúng logic.
 * @memberof errors
 * @class
 */
class ValidationError extends ClientError {
    constructor(message, code, details) {
        super(message)
        this.type = 'ValidationError'
        this.code = code || 412
        if (details) this.details = details
    }
}

/**
 * @classDesc Định nghĩa các lỗi không thể xác thực người dùng.
 * @memberof errors
 * @class
 */
class AuthenticationError extends ClientError {
    constructor(message, code = 401) {
        super(message)
        this.type = 'AuthenticationError'
        this.code = code
    }
}

class ForbiddenError extends ClientError {
    constructor(message, code = 403) {
        super(message)
        this.type = 'ForbiddenError'
        this.code = code
    }
}

/**
 * @classDesc Định nghĩa các lỗi thuộc về sung đột dữ liệu, dữ liệu cập nhật không đúng logic.
 * @memberof errors
 * @class
 */
class ConflictError extends ClientError {
    constructor(message, code = 409) {
        super(message)
        this.type = 'ConflictError'
        this.code = code
    }
}

/**
 * @classDesc Định nghĩa các lỗi chưa xác định được nguyên nhân.
 * @memberof errors
 * @class
 */
class UnknownError extends ServerError {
    constructor(error) {
        super(error.message)
        this.type = 'UnknownError'
        this.code = 500
    }
}

/**
 * @classDesc Định nghĩa các lỗi về xử lý dữ liệu.
 * @memberof errors
 * @class
 */
class DataError extends ServerError {
    constructor(message, code = 500) {
        super(message, code)
        this.type = 'DataError'
    }
}

/**
 * @classDesc Định nghĩa các lỗi do không tìm thấy tài nguyên.
 * @memberof errors
 * @class
 */
class NotFoundError extends Error {
    constructor(message, code = 404) {
        super(message)
        this.type = 'NotFoundError'
        this.code = code
    }
}

/**
 * @classDesc Định nghĩa các lỗi do người dùng không có quyền truy cập.
 * @memberof errors
 * @class
 */
class PermissionError extends ClientError {
    constructor(message, code = 403) {
        super(message)
        this.type = 'PermissionError'
        this.code = code
    }
}

/**
 * @classDesc Định nghĩa các lỗi do trùng lặp dữ liệu.
 * @memberof errors
 * @class
 */
class DuplicatedError extends DataError {
    constructor(message, code = 500) {
        super(message, code)
        this.type = 'DuplicatedError'
    }
}

module.exports = {
    AuthenticationError,
    ClientError,
    DataError,
    DuplicatedError,
    ForbiddenError,
    NotFoundError,
    PermissionError,
    ServerError,
    ThirdSystemError,
    UnknownError,
    ValidationError,
    ConflictError,
}

exports.format = note => {
    if (!note || typeof note !== 'object') {
        return note
    }

    const obj = { ...note }
    obj.id = note._id
    delete obj._id
    delete obj.__v

    return obj
}

exports.formatList = note => {
    if (!note || typeof note !== 'object') {
        return note
    }

    const obj = { ...note }
    obj.id = note._id
    delete obj._id
    delete obj.__v

    return obj
}

exports.protect = record => {
    if (!record || typeof record !== 'object') {
        return record
    }

    const protectedRecord = { ...record }
    protectedRecord.id = record._id

    delete protectedRecord._id
    delete protectedRecord.__v

    return protectedRecord
}

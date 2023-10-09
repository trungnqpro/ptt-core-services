exports.format = email => {
    if (!email || typeof email !== 'object') {
        return email
    }

    const obj = { ...email }
    obj.id = email._id
    delete obj._id
    delete obj.__v
    delete obj.createdBy

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
    delete protectedRecord.createdBy

    return protectedRecord
}
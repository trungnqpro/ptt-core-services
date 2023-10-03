exports.format = role => {
    if (!role || typeof role !== 'object') {
        return role
    }

    const newRole = { ...role }
    newRole.id = role._id
    delete newRole._id
    delete newRole.__v

    return newRole
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
exports.format = note => {
    if (!note || typeof note !== 'object') {
        return note
    }

    const obj = { ...note }
    obj.id = note._id
    delete obj.createdBy
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
    delete obj.createdBy
    delete obj._id
    delete obj.__v

    // parent
    if(obj.parentId) {
        obj.parentId.id = note.parentId._id
        delete obj.createdBy
        delete obj.parentId._id
        delete obj.parentId.__v
    }

    return obj
}

exports.protect = record => {
    if (!record || typeof record !== 'object') {
        return record
    }

    const protectedRecord = { ...record }
    protectedRecord.id = record._id

    delete protectedRecord.createdBy
    delete protectedRecord._id
    delete protectedRecord.__v

    // parent
    if(protectedRecord.parentId) {
        protectedRecord.parentId.id = record.parentId._id
        delete protectedRecord.createdBy
        delete protectedRecord.parentId._id
        delete protectedRecord.parentId.__v
    }

    return protectedRecord
}
const ObjectId = require('mongoose').Types.ObjectId

exports.format = note => {
    if (!note || typeof note !== 'object') {
        return note
    }

    const obj = { ...note }
    obj.id = note._id
    delete obj.createdBy
    delete obj._id
    delete obj.__v
    delete obj.createdBy

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
    delete obj.createdBy

    // parent
    if(obj.parentId) {
        obj.parentId.id = note.parentId._id
        delete obj.createdBy
        delete obj.parentId._id
        delete obj.parentId.__v
        delete obj.parentId.createdBy
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
    delete protectedRecord.createdBy

    // parent
    if( !(protectedRecord.parentId instanceof ObjectId) && protectedRecord.parentId) {
        protectedRecord.parentId.id = record.parentId._id
        delete protectedRecord.createdBy
        delete protectedRecord.parentId._id
        delete protectedRecord.parentId.__v
        delete protectedRecord.parentId.createdBy
    }

    return protectedRecord
}
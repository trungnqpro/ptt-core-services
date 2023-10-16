const ObjectId = require('mongoose').Types.ObjectId

exports.format = note => {
    if (!note || typeof note !== 'object') {
        return note
    }

    const obj = { ...note }
    obj.id = note._id
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
    delete obj._id
    delete obj.__v
    delete obj.createdBy

    // departmentId
    if (!(obj.departmentId instanceof ObjectId) && obj.departmentId) {
        obj.departmentId.id = obj.departmentId._id
        delete obj.departmentId._id
        delete obj.departmentId.__v
        delete obj.departmentId.createdBy
    }

    // positionId
    if (!(obj.positionId instanceof ObjectId) && obj.positionId) {
        obj.positionId.id = obj.positionId._id
        delete obj.positionId._id
        delete obj.positionId.__v
        delete obj.positionId.createdBy
    }

    // badgeId
    if (!(obj.badgeId instanceof ObjectId) && obj.badgeId) {
        obj.badgeId.id = obj.badgeId._id
        delete obj.badgeId._id
        delete obj.badgeId.__v
        delete obj.badgeId.createdBy
    }

    // folderId
    if (!(obj.folderId instanceof ObjectId) && obj.folderId) {
        obj.folderId.id = obj.folderId._id
        delete obj.folderId._id
        delete obj.folderId.__v
        delete obj.folderId.createdBy
    }

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

    // departmentId
    if (!(protectedRecord.departmentId instanceof ObjectId) && protectedRecord.departmentId) {
        protectedRecord.departmentId.id = record.departmentId._id
        delete protectedRecord.departmentId._id
        delete protectedRecord.departmentId.__v
        delete protectedRecord.departmentId.createdBy
    }

    // positionId
    if (!(protectedRecord.positionId instanceof ObjectId) && protectedRecord.positionId) {
        protectedRecord.positionId.id = record.positionId._id
        delete protectedRecord.positionId._id
        delete protectedRecord.positionId.__v
        delete protectedRecord.positionId.createdBy
    }

    // badgeId
    if (!(protectedRecord.badgeId instanceof ObjectId) && protectedRecord.badgeId) {
        protectedRecord.badgeId.id = record.badgeId._id
        delete protectedRecord.badgeId._id
        delete protectedRecord.badgeId.__v
        delete protectedRecord.badgeId.createdBy
    }

    // folderId
    if (!(protectedRecord.folderId instanceof ObjectId) && protectedRecord.folderId) {
        protectedRecord.folderId.id = record.folderId._id
        delete protectedRecord.folderId._id
        delete protectedRecord.folderId.__v
        delete protectedRecord.folderId.createdBy
    }

    return protectedRecord
}

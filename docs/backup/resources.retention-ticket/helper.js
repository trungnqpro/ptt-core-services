const ObjectId = require('mongoose').Types.ObjectId
const UserHelper = require('../user/helper')
const SubjectHelper = require('../subject/helper')

exports.format = request => {
    if (!request || typeof request !== 'object') {
        return request
    }

    const obj = { ...request }
    obj.id = request._id
    delete obj._id
    delete obj.__v

    if (obj.subjectId && typeof obj.subjectId === 'object' && !(obj.subjectId instanceof ObjectId)) {
        obj.subject = SubjectHelper.formatOnBaseInfos(obj.subjectId)
        delete obj.subjectId
    }

    if (obj.approverId && typeof obj.approverId === 'object' && !(obj.approverId instanceof ObjectId)) {
        obj.approver = UserHelper.getShortProfile(obj.approverId)
        delete obj.approverId
    }

    if (obj.studentId && typeof obj.studentId === 'object' && !(obj.studentId instanceof ObjectId)) {
        obj.student = UserHelper.getFullProfile(obj.studentId)
        delete obj.studentId
    }

    return obj
}

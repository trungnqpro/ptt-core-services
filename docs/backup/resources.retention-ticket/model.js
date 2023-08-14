const moment = require('moment')
const RetentionTicketSchema = require('./schema-mg')

/**
 * fetch retention tickets
 * @returns array of retention tickets
 */

exports.fetch = async (filter = {}, sort = { id: -1 }, skip = 0, limit = 20) => {
    const _filter = { ...filter, isDeleted: false }
    if (_filter.fromDate) {
        _filter.createdAt = { $gt: moment(_filter.fromDate) }
        delete _filter.fromDate
    }

    const _sort = { ...sort }
    _sort._id = _sort.id
    delete _sort.id

    const tickets = await RetentionTicketSchema.find(_filter)
        .sort(_sort)
        .skip(skip)
        .limit(limit)
        .populate([{ path: 'subjectId' }, { path: 'curriculumId' }])
        .populate('studentId')
        .lean({ getters: true })

    return tickets
}

exports.create = async entity => {
    const ticket = new RetentionTicketSchema(entity)
    await ticket.save()

    return ticket.toJSON()
}

exports.getById = async id => {
    const ticket = await RetentionTicketSchema.findById(id)
        .populate({ path: 'subjectId', populate: { path: 'curriculumId' } })
        .populate('studentId')
        .lean({ getters: true })

    return ticket
}

exports.getByStudentAndSubject = async (studentId, subjectId) => {
    const tickets = await RetentionTicketSchema.find({
        studentId,
        subjectId,
    }).lean({
        getters: true,
    })

    return tickets
}

exports.updateById = async (id, updatedFields) => {
    const ticket = await RetentionTicketSchema.findByIdAndUpdate(id, updatedFields, {
        new: true,
    })
        .populate({ path: 'subjectId', populate: { path: 'curriculumId' } })
        .populate('studentId')
        .lean({ getters: true })

    return ticket
}

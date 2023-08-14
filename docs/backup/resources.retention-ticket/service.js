const moment = require('moment')
const NotificationService = require('../notification/service')
const RetentionTicketModel = require('./model')
const LearningProgress = require('../learning-progress')
const LearningProgressSchema = require('../learning-progress/schema-mg')
const RetentionTicketSchema = require('./schema-mg')
const SubjectCache = require('../subject/cache')

const {
    PermissionError,
    ValidationError,
    ConflictError,
    NotFoundError,
    DataError,
} = require('../../libs/errors')
const { PENDING, ACCEPTED, REJECTED } = require('./static').STATUS
const debug = require('../../libs/debug')()

/**
 * Get list of retention tickets
 * @returns
 */
exports.fetch = async (filter, sort, skip, limit) => {
    const tickets = await RetentionTicketModel.fetch(filter, sort, skip, limit)

    return tickets
}

exports.create = async fields => {
    const { studentId, subjectId } = fields
    const [learningProgress, tickets, subject] = await Promise.all([
        LearningProgress.Service.getByStudentAndSubject(studentId, subjectId),
        RetentionTicketModel.getByStudentAndSubject(studentId, subjectId),
        SubjectCache.getById(subjectId),
    ])

    if (!learningProgress) {
        throw new PermissionError("You don't have permission on this subject")
    }

    const hitRequest = tickets.find(e => e.status === PENDING && !e.isClosed && !e.isDeleted)
    if (hitRequest) {
        throw new ConflictError(
            "There's a pending ticket. Please waiting for result from us before creating a new.",
        )
    }

    if (
        moment(learningProgress.expirationDate || undefined).isAfter(
            moment(fields.request.expirationDate).startOf('day'),
        )
    ) {
        throw new ValidationError('"To date" must be after expiration date of course')
    }

    const ticket = await RetentionTicketModel.create(fields)

    sendNotification(
        studentId,
        `A new retention ticket was created (course: ${subject.name}, expiration date: ${moment(
            fields.request.expirationDate,
        ).format('YYYY-MM-DD')}, note: ${fields.request.note})`,
    )

    return ticket
}

exports.accept = async (id, result, approverId) => {
    let ticket = await RetentionTicketModel.getById(id)
    if (!ticket || ticket.isDeleted) {
        throw new NotFoundError(`Not found Retention Request ${id}`)
    }
    const learningProgress = await LearningProgress.Service.getByStudentAndSubject(
        ticket.studentId._id,
        ticket.subjectId._id,
    )
    if (!learningProgress) {
        throw new NotFoundError('Not found Study Registration for this subject')
    }

    if (moment().isAfter(moment(result.expirationDate, 'YYYY-MM-DD'))) {
        throw new ValidationError('"Retention expiration to date" must be after today')
    }

    const _result = { ...result, approvedDate: moment() }
    ticket = await RetentionTicketModel.updateById(id, {
        result: _result,
        approverId,
        oldLearningStatus: {
            status: learningProgress.status,
            expirationDate: learningProgress.expirationDate,
        },
        status: ACCEPTED,
    })

    await LearningProgress.Service.retentionById(learningProgress._id, id).catch(error =>
        debug.error(`Cannot update learning progress ${learningProgress._id}`, error),
    )

    sendNotification(
        ticket.studentId._id,
        `A retention ticket was accepted (course: ${
            ticket.subjectId.name
        }, expiration date: ${moment(_result.expirationDate).format('YYYY-MM-DD')}${
            _result.note ? ', note: ' + _result.note : ''
        })`,
    )

    return ticket
}

exports.reject = async (id, result, approverId) => {
    let ticket = await RetentionTicketModel.getById(id)
    if (!ticket || ticket.isDeleted) {
        throw new NotFoundError(`Not found Retention Request ${id}`)
    }

    if (ticket.status === REJECTED) {
        throw new ConflictError(`This ticket was rejected ${id}`)
    }

    const learningProgress = await LearningProgress.Service.getByStudentAndSubject(
        ticket.studentId._id,
        ticket.subjectId._id,
    )
    if (!learningProgress) {
        throw new NotFoundError('Not found Study Registration for this subject')
    }

    const updatedLearningProgress = {}

    if (ticket.oldLearningStatus?.status) {
        updatedLearningProgress.status = ticket.oldLearningStatus.status
    }
    if (ticket.oldLearningStatus?.expirationDate) {
        updatedLearningProgress.expirationDate = ticket.oldLearningStatus.expirationDate
    }

    await LearningProgress.Service.updateExpirationDateById(
        learningProgress._id,
        updatedLearningProgress,
    ).catch(error => debug.error(`Cannot update learning progress ${learningProgress._id}`, error))

    ticket = await RetentionTicketModel.updateById(id, {
        result,
        approverId,
        status: REJECTED,
    })

    sendNotification(
        ticket.studentId._id,
        `A retention ticket was rejected (course: ${ticket.subjectId.name}, reason: ${result.note})`,
    )

    return ticket
}

exports.closeById = async (id, studentId) => {
    const ticket = await RetentionTicketModel.getById(id)
    if (!ticket || ticket.isDeleted) {
        throw new NotFoundError(`Not found Retention Request ${id}`)
    }
    if (studentId && ticket.studentId?._id?.toString() !== studentId) {
        throw new PermissionError("You aren't owner of this retention ticket")
    }

    const { isClosed, result, oldLearningStatus, status, subjectId } = ticket

    if (isClosed) {
        throw new ConflictError('Retention Request has been closed')
    }
    if (status === PENDING) {
        await RetentionTicketModel.updateById(ticket.id, {
            isClosed: true,
            closeStatus: { closeDate: moment().format('YYYY-MM-DD') },
        })

        return
    }
    if (status === REJECTED) {
        throw new ConflictError('Retention Request has been rejected')
    }
    if (!oldLearningStatus?.status || !oldLearningStatus?.expirationDate) {
        throw new DataError('Miss old learning status')
    }
    if (!result?.approvedDate || !result?.expirationDate) {
        throw new DataError('Miss approved result')
    }

    const activeDate = moment().isBefore(moment(result.expirationDate))
        ? moment()
        : moment(result.expirationDate)
    let differentDate = Math.max(activeDate.diff(moment(result.approvedDate), 'days', true), 0)
    differentDate = Math.ceil(differentDate)

    const newExpirationDate = moment(oldLearningStatus.expirationDate)
        .add(differentDate, 'days')
        .format('YYYY-MM-DD')

    await LearningProgressSchema.updateOne(
        { studentId, subjectId },
        { status: oldLearningStatus.status, expirationDate: newExpirationDate },
    )

    await RetentionTicketSchema.updateOne({
        _id: ticket._id,
        isClosed: true,
        closeStatus: { closeDate: moment() },
    })

    sendNotification(
        ticket.studentId._id,
        `A retention ticket was closed (course: ${ticket.subjectId.name}, new expiration date: ${newExpirationDate})`,
    )
}

function sendNotification(targetUserId, content) {
    return NotificationService.createSystemNoti(targetUserId, 'Retention', content).catch(error =>
        debug.error(`Cannot send notification to student ${targetUserId}`, error),
    )
}

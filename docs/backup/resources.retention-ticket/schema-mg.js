const mongoose = require('mongoose')
const Schema = mongoose.Schema

const { DefaultDB } = require('../../connections/mongodb')
const mf = require('../../libs').mongoField
const { PENDING } = require('./static').STATUS

// TODO: implement cronjob scan expired questions
const schema = new Schema(
    {
        _id: mf().id().required().auto().j(),
        studentId: mf().id().ref('User').j(),
        subjectId: mf().id().ref('Subject').j(),
        oldLearningStatus: {
            status: mf().string().j(),
            expirationDate: mf().date().j(), // ngày hết hạn học tập của môn học (giá trị ngay trước thời điểm chấp thuận)
        },
        request: {
            expirationDate: mf().date().j(), // ngày hết hạn bảo lưu
            note: mf().string().required().j(),
        },
        result: {
            expirationDate: mf().date().j(), // ngày hết hạn bảo lưu được admin điều chỉnh & chấp thuận
            note: mf().string().j(),
            approvedDate: mf().date().j(),
        },
        closeStatus: {
            closedDate: mf().date().j(),
        },
        approverId: mf().id().ref('User').j(),
        status: mf().string(PENDING).j(),
        isClosed: mf().boolean(false).j(), // flag define request is closed by student/auto by system cronjob
        isDeleted: mf().boolean(false).j(),
    },
    { timestamps: true },
)

schema.index({ createdAt: 1 })

module.exports = DefaultDB.model('RetentionTicket', schema, 'retentionTickets')

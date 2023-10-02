const Handlebars = require('handlebars')
const utils = require('../../libs/utils')
const Email = require('.')
const EmailLog = require('../email-log')
const User = require('../user')
const moment = require('moment-timezone')
const emailType = require('./static').TYPE
const Promise = require('bluebird')

exports.sendEmailWelcome = async data => {
    const user = User.Helper.getProfileAndPassword(data)
    const name = [user.firstName, user.lastName].join(' ')
    user.fullName = name !== ' ' ? name : user.username

    var emailTemplate = await Email.Model.getByType(emailType.WELCOME)
    if (emailTemplate) {
        var templateHTML = Handlebars.compile(emailTemplate.description)
        var templateTitle = Handlebars.compile(emailTemplate.title)

        const html = templateHTML(user)
        const title = templateTitle(user)

        utils.sendMail(user.email, title, null, html).then(() => {
            EmailLog.Schema.create({
                sendToUserId: user.id,
                sendToUserEmail: user.email,
                templateId: emailTemplate._id,
                status: 'success',
                type: emailType.WELCOME,
            })
        })
    }
}

exports.sendMultipleEmailWelcome = async listUser => {
    var emailTemplate = await Email.Model.getByType(emailType.WELCOME)
    if (emailTemplate) {
        await Promise.map(
            listUser,
            async el => {
                const user = User.Helper.getProfileAndPassword(el)
                user.password = process.env.STUDENT_PASSWORD_DEFAULT
                const name = [user.firstName, user.lastName].join(' ')
                user.fullName = name || user.username
                user.link_LMS = 'btl86.vn'

                var templateHTML = Handlebars.compile(emailTemplate.description)
                var templateTitle = Handlebars.compile(emailTemplate.title)

                const html = templateHTML(user)
                const title = templateTitle(user)

                const checkLog = await EmailLog.Schema.findOne({
                    sendToUserId: user.id,
                    type: emailType.WELCOME,
                }).lean()
                if (!checkLog) {
                    utils.sendMail(user.email, title, null, html).then(() => {
                        EmailLog.Schema.create({
                            sendToUserId: user.id,
                            sendToUserEmail: user.email,
                            templateId: emailTemplate._id,
                            status: 'success',
                            type: emailType.WELCOME,
                        })
                    })
                }
            },
            { concurrency: 1 },
        )
    }
}

exports.sendEmailWarning = async () => {
    const emailTemplate = await Email.Model.getByType(emailType.WARNING)
    const listUser = await User.Model.getUserInactivateByDay(
        moment().subtract(emailTemplate.emailDeliveryTime, 'd').format('YYYY-MM-DD'),
    )
    if (emailTemplate) {
        await Promise.map(
            listUser,
            async el => {
                const user = User.Helper.getProfileAndPassword(el)
                user.password = process.env.STUDENT_PASSWORD_DEFAULT
                const name = [user.firstName, user.lastName].join(' ')
                user.fullName = name || user.username

                var templateHTML = Handlebars.compile(emailTemplate.description)
                var templateTitle = Handlebars.compile(emailTemplate.title)

                const html = templateHTML(user)
                const title = templateTitle(user)

                const checkLog = await EmailLog.Schema.findOne({
                    sendToUserId: user.id,
                    type: emailType.WARNING,
                }).lean()
                if (!checkLog) {
                    utils.sendMail(user.email, title, null, html).then(() => {
                        EmailLog.Schema.create({
                            sendToUserId: user.id,
                            sendToUserEmail: user.email,
                            templateId: emailTemplate._id,
                            status: 'success',
                            type: emailType.WARNING,
                        })
                    })
                    await Promise.delay(20000)
                }
            },
            { concurrency: 1 },
        )
    }
}

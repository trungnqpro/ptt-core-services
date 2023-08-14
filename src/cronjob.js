const chalk = require('chalk')
const CronJob = require('cron').CronJob
let debug = console
const env = process.env
debug.log(chalk.blue('Environment:'), chalk.green(env.NODE_ENV))

const bootstrap = require('./bootstrap')

async function run() {
    try {
        await bootstrap.load()
        debug = require('./libs/debug')()
        const jobs = require('./jobs')

        console.log('env.CRONJOB_TIME_SUPPORT_TICKET', env.CRONJOB_TIME_SUPPORT_TICKET)

        new CronJob('0 0 3 * * *', jobs.clearHubSpotLog, null, true)
        // '*/5 * * * * *' => dùng để test
        new CronJob(env.CRONJOB_TIME_COUNT_TOTAL_SUPPORT_TICKET, jobs.SumSupportTicket, null, true) // tính báo cáo ticket của ngày hôm nay bao nhiêu phi
        new CronJob(env.CRONJOB_TIME_OPEN_ACTIVITY, jobs.openActivity, null, true)
        new CronJob(
            env.CRONJOB_TIME_REPORT_STATISTIC_ATTENDANCE,
            jobs.report.statisticAttendance,
            null,
            true,
        )
        new CronJob(
            env.CRONJOB_TIME_CALCULATE_ACADEMIC_RESULT,
            jobs.calculateAcademicResult,
            null,
            true,
        )
        new CronJob(
            env.CRONJOB_TIME_GRANT_CERTIFICATE,
            jobs.grantCertificate.grantCertificateV2,
            null,
            true,
        )
        new CronJob(
            env.CRONJOB_TIME_SEND_EMAIL_TO_STUDENT_INACTIVATE,
            jobs.sendToEmailToStudentInactivate,
            null,
            true,
        )
        new CronJob(
            env.CRONJOB_TIME_SEND_TICKET_EXPIRED_FOUNDATION,
            jobs.ticketExpiredFoundation,
            null,
            true,
        )

        console.log('Cronjob is started')

        process.on('SIGINT', () => {
            process.exit(0)
        })
    } catch (err) {
        debug.error('Occurs error when starting server\n', err)
        debug.error(err)
        console.log(err)
        debug.warn(chalk.yellow('Server is stopping ...'))
        process.exit(1)
    }
}

run()

process.on('uncaughtException', error => {
    debug.error('Uncaught Exception: ', error)
})

process.on('unhandledRejection', (reason, p) => {
    debug.error('Unhandled Rejection at: Promise', p, 'reason:', reason)
})

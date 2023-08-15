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

        // '*/5 * * * * *' => dùng để test
        new CronJob(
            env.CRONJOB_TIME_SEND_EMAIL_TO_STUDENT_INACTIVATE,
            jobs.sendToEmailToStudentInactivate,
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

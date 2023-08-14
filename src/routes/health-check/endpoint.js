const Router = require('@koa/router')
const ctrl = require('./controller')

const router = new Router({ prefix: '/health-check' })

router.get('/', ctrl.healthCheck) // get health infos

module.exports = router

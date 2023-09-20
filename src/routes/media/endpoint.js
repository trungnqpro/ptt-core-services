const Router = require('@koa/router')
const { validateApiSchema: validate, validateAccessToken: auth } = require('../../www/middleware')
const ctrl = require('./controller')
const schemas = require('./schema-api')

const router = new Router({ prefix: '/media' })
router.use(auth)

router.post('/', validate(schemas.post), ctrl.upload) // upload media files

module.exports = router

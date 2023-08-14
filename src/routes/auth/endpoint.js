const Router = require('@koa/router')
const {
    validateApiSchema: validate,
    useOriginalResponse,
    preventLog,
} = require('../../www/middleware')
const ctrl = require('./controller')
const schemas = require('./schema-api')

const router = new Router({ prefix: '/auth' })
router.use(preventLog)

router.post('/login', validate(schemas.login), ctrl.login) // get list of users
router.post('/sign-up', validate(schemas.signup), ctrl.signup)
router.get('/verify-email', useOriginalResponse, ctrl.verifyEmail)
router.get(
    '/resend-verifying-email',
    validate(schemas.resendVerifyingEmail),
    useOriginalResponse,
    ctrl.resendVerifyingEmail,
)
router.get('/access-token', validate(schemas.getAccessToken), ctrl.getAccessToken)

router.get('/forgot-password', validate(schemas.forgotPassword), ctrl.forgotPassword)

router.put('/set-password', validate(schemas.setPassword), ctrl.setPassword)

module.exports = router

const Router = require('@koa/router')
const {
    validateApiSchema: validate,
    validateAccessToken: auth,
    notAllowGuest,
    //   checkPermission,
} = require('../../www/middleware')
const ctrl = require('./controller')
const schemas = require('./schema-api')
//const permissionCodes = require('../../libs/utils').getPermissionCodes(require('./permission'))

const router = new Router({ prefix: '/email-template' })

router.use(auth)

router.get('/', notAllowGuest, ctrl.fetch)

router.post('/', notAllowGuest, validate(schemas.post), ctrl.create)

router.get('/:id', notAllowGuest, validate(schemas.idDelete), ctrl.getById)

module.exports = [router]

const Router = require('@koa/router')
const {
    validateApiSchema: validate,
    validateAccessToken: auth,
    notAllowStudent,
    //   checkPermission,
} = require('../../www/middleware')
const ctrl = require('./controller')
const schemas = require('./schema-api')
//const permissionCodes = require('../../libs/utils').getPermissionCodes(require('./permission'))

const router = new Router({ prefix: '/university' })

router.use(auth)

router.get('/', ctrl.fetch)

router.post('/', notAllowStudent, validate(schemas.post), ctrl.create)

router.put('/:id', notAllowStudent, validate(schemas.idPut), ctrl.update)

router.del('/:id', notAllowStudent, validate(schemas.idDelete), ctrl.delete)

module.exports = [router]

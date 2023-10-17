const Router = require('@koa/router')
const {
    validateApiSchema: validate,
    validateAccessToken: auth,
    checkPermission,
    preventLog,
} = require('../../www/middleware')
const ctrl = require('./controller')
const schemas = require('./schema-api')
const permissionCodes = require('../../libs/utils').getPermissionCodes(require('./permission'))

const router = new Router({ prefix: '/system/ips' })
router.use(auth)

router.get('/', checkPermission(permissionCodes.listIpAccess), validate(schemas.get), ctrl.fetch)

router.post(
    '/',
    checkPermission(permissionCodes.createIpAccess),
    validate(schemas.post),
    ctrl.create,
)

router.get(
    '/:id',
    checkPermission(permissionCodes.viewDetailsOfIpAccess),
    validate(schemas.idGet),
    ctrl.get,
)
router.put(
    '/:id',
    checkPermission(permissionCodes.updateIpAccess),
    validate(schemas.idPut),
    ctrl.update,
)
router.del(
    '/:id',
    checkPermission(permissionCodes.deleteIpAccess),
    validate(schemas.idDelete),
    ctrl.delete,
)

module.exports = [router]

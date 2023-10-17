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

const router = new Router({ prefix: '/system/folders' })
router.use(auth)

router.get('/', checkPermission(permissionCodes.listSystemFolder), validate(schemas.get), ctrl.fetch)

router.post(
    '/',
    checkPermission(permissionCodes.createSystemFolder),
    validate(schemas.post),
    ctrl.create,
)

router.get(
    '/:id',
    checkPermission(permissionCodes.viewDetailsOfSystemFolder),
    validate(schemas.idGet),
    ctrl.get,
)
router.put(
    '/:id',
    checkPermission(permissionCodes.updateSystemFolder),
    validate(schemas.idPut),
    ctrl.update,
)
router.del(
    '/:id',
    checkPermission(permissionCodes.deleteSystemFolder),
    validate(schemas.idDelete),
    ctrl.delete,
)

module.exports = [router]

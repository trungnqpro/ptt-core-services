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

const router = new Router({ prefix: '/system/backups' })
router.use(auth)

router.get('/', checkPermission(permissionCodes.listSystemBackup), validate(schemas.get), ctrl.fetch)

router.post(
    '/',
    checkPermission(permissionCodes.createSystemBackup),
    validate(schemas.post),
    ctrl.create,
)

router.get(
    '/:id',
    checkPermission(permissionCodes.viewDetailsOfSystemBackup),
    validate(schemas.idGet),
    ctrl.get,
)
router.put(
    '/:id',
    checkPermission(permissionCodes.updateSystemBackup),
    validate(schemas.idPut),
    ctrl.update,
)
router.del(
    '/:id',
    checkPermission(permissionCodes.deleteSystemBackup),
    validate(schemas.idDelete),
    ctrl.delete,
)

module.exports = [router]

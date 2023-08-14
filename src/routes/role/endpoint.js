const Router = require('@koa/router')
const {
    validateApiSchema: validate,
    validateAccessToken: auth,
    checkPermission,
} = require('../../www/middleware')
const ctrl = require('./controller')
const schemas = require('./schema-api')
const permissionCodes = require('../../libs/utils').getPermissionCodes(require('./permission'))

const router = new Router({ prefix: '/roles' })
router.use(auth)

router.get('/', checkPermission(permissionCodes.listRole), ctrl.fetch)
router.post('/', checkPermission(permissionCodes.createRole), validate(schemas.post), ctrl.create)

router.get(
    '/:id',
    checkPermission(permissionCodes.viewDetailsOfRole),
    validate(schemas.idGet),
    ctrl.get,
)
router.put(
    '/:id',
    checkPermission(permissionCodes.updateRole),
    validate(schemas.idPut),
    ctrl.update,
)
router.del(
    '/:id',
    checkPermission(permissionCodes.deleteRole),
    validate(schemas.idDelete),
    ctrl.delete,
)

module.exports = router

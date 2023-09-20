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

const routerConfigHome = new Router({ prefix: '/config-folder' })
routerConfigHome.use(auth)

routerConfigHome.get('/', checkPermission(permissionCodes.listConfigHome), validate(schemas.get), ctrl.fetch)

routerConfigHome.post(
    '/',
    checkPermission(permissionCodes.createConfigHome),
    validate(schemas.post),
    ctrl.create,
)

routerConfigHome.get(
    '/:id',
    checkPermission(permissionCodes.viewDetailsOfConfigHome),
    validate(schemas.idGet),
    ctrl.get,
)
routerConfigHome.put(
    '/:id',
    checkPermission(permissionCodes.updateConfigHome),
    validate(schemas.idPut),
    ctrl.update,
)
routerConfigHome.del(
    '/:id',
    checkPermission(permissionCodes.deleteConfigHome),
    validate(schemas.idDelete),
    ctrl.delete,
)

module.exports = [routerConfigHome]

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

const routerConfigMenu = new Router({ prefix: '/config-menus' })
routerConfigMenu.use(auth)

routerConfigMenu.get('/', checkPermission(permissionCodes.listConfigMenu), validate(schemas.get), ctrl.fetch)

routerConfigMenu.post(
    '/',
    checkPermission(permissionCodes.createConfigMenu),
    validate(schemas.post),
    ctrl.create,
)

routerConfigMenu.get(
    '/:id',
    checkPermission(permissionCodes.viewDetailsOfConfigMenu),
    validate(schemas.idGet),
    ctrl.get,
)
routerConfigMenu.put(
    '/:id',
    checkPermission(permissionCodes.updateConfigMenu),
    validate(schemas.idPut),
    ctrl.update,
)
routerConfigMenu.del(
    '/:id',
    checkPermission(permissionCodes.deleteConfigMenu),
    validate(schemas.idDelete),
    ctrl.delete,
)

module.exports = [routerConfigMenu]

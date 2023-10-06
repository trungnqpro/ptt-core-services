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

const routerSystemFolder = new Router({ prefix: '/system-folders' })
routerSystemFolder.use(auth)

routerSystemFolder.get('/', checkPermission(permissionCodes.listSystemFolder), validate(schemas.get), ctrl.fetch)

routerSystemFolder.post(
    '/',
    checkPermission(permissionCodes.createSystemFolder),
    validate(schemas.post),
    ctrl.create,
)

routerSystemFolder.get(
    '/:id',
    checkPermission(permissionCodes.viewDetailsOfSystemFolder),
    validate(schemas.idGet),
    ctrl.get,
)
routerSystemFolder.put(
    '/:id',
    checkPermission(permissionCodes.updateSystemFolder),
    validate(schemas.idPut),
    ctrl.update,
)
routerSystemFolder.del(
    '/:id',
    checkPermission(permissionCodes.deleteSystemFolder),
    validate(schemas.idDelete),
    ctrl.delete,
)

module.exports = [routerSystemFolder]

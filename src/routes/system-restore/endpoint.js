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

const routerConfigBackup = new Router({ prefix: '/retores' })
routerConfigBackup.use(auth)

routerConfigBackup.get('/', checkPermission(permissionCodes.listConfigBackup), validate(schemas.get), ctrl.fetch)

routerConfigBackup.post(
    '/',
    checkPermission(permissionCodes.createConfigBackup),
    validate(schemas.post),
    ctrl.create,
)

routerConfigBackup.get(
    '/:id',
    checkPermission(permissionCodes.viewDetailsOfConfigBackup),
    validate(schemas.idGet),
    ctrl.get,
)
routerConfigBackup.put(
    '/:id',
    checkPermission(permissionCodes.updateConfigBackup),
    validate(schemas.idPut),
    ctrl.update,
)
routerConfigBackup.del(
    '/:id',
    checkPermission(permissionCodes.deleteConfigBackup),
    validate(schemas.idDelete),
    ctrl.delete,
)

module.exports = [routerConfigBackup]

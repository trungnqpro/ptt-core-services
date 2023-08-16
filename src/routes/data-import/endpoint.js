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

const routerDataImport = new Router({ prefix: '/data-imports' })
routerDataImport.use(auth)

routerDataImport.get('/', checkPermission(permissionCodes.listDataImport), validate(schemas.get), ctrl.fetch)

routerDataImport.post(
    '/',
    checkPermission(permissionCodes.createDataImport),
    validate(schemas.post),
    ctrl.create,
)

routerDataImport.get(
    '/:id',
    checkPermission(permissionCodes.viewDetailsOfDataImport),
    validate(schemas.idGet),
    ctrl.get,
)
routerDataImport.put(
    '/:id',
    checkPermission(permissionCodes.updateDataImport),
    validate(schemas.idPut),
    ctrl.update,
)
routerDataImport.del(
    '/:id',
    checkPermission(permissionCodes.deleteDataImport),
    validate(schemas.idDelete),
    ctrl.delete,
)

module.exports = [routerDataImport]

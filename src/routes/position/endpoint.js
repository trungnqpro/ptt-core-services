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

const routerPosition = new Router({ prefix: '/positions' })
routerPosition.use(auth)

routerPosition.get('/', checkPermission(permissionCodes.listPosition), validate(schemas.get), ctrl.fetch)

routerPosition.post(
    '/',
    checkPermission(permissionCodes.createPosition),
    validate(schemas.post),
    ctrl.create,
)

routerPosition.get(
    '/:id',
    checkPermission(permissionCodes.viewDetailsOfPosition),
    validate(schemas.idGet),
    ctrl.get,
)
routerPosition.put(
    '/:id',
    checkPermission(permissionCodes.updatePosition),
    validate(schemas.idPut),
    ctrl.update,
)
routerPosition.del(
    '/:id',
    checkPermission(permissionCodes.deletePosition),
    validate(schemas.idDelete),
    ctrl.delete,
)

module.exports = [routerPosition]

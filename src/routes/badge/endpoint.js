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

const routerBadge = new Router({ prefix: '/badges' })
routerBadge.use(auth)

routerBadge.get('/', checkPermission(permissionCodes.listBadge), validate(schemas.get), ctrl.fetch)

routerBadge.post(
    '/',
    checkPermission(permissionCodes.createBadge),
    validate(schemas.post),
    ctrl.create,
)

routerBadge.get(
    '/:id',
    checkPermission(permissionCodes.viewDetailsOfBadge),
    validate(schemas.idGet),
    ctrl.get,
)
routerBadge.put(
    '/:id',
    checkPermission(permissionCodes.updateBadge),
    validate(schemas.idPut),
    ctrl.update,
)
routerBadge.del(
    '/:id',
    checkPermission(permissionCodes.deleteBadge),
    validate(schemas.idDelete),
    ctrl.delete,
)

module.exports = [routerBadge]

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

const routerReaction = new Router({ prefix: '/reactions' })
routerReaction.use(auth)

routerReaction.get('/', checkPermission(permissionCodes.listReaction), validate(schemas.get), ctrl.fetch)

routerReaction.post(
    '/',
    checkPermission(permissionCodes.createReaction),
    validate(schemas.post),
    ctrl.create,
)

routerReaction.get(
    '/:id',
    checkPermission(permissionCodes.viewDetailsOfReaction),
    validate(schemas.idGet),
    ctrl.get,
)
routerReaction.put(
    '/:id',
    checkPermission(permissionCodes.updateReaction),
    validate(schemas.idPut),
    ctrl.update,
)
routerReaction.del(
    '/:id',
    checkPermission(permissionCodes.deleteReaction),
    validate(schemas.idDelete),
    ctrl.delete,
)

module.exports = [routerReaction]

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

const routerMedia = new Router({ prefix: '/medias' })
routerMedia.use(auth)

routerMedia.get('/', checkPermission(permissionCodes.listMedia), validate(schemas.get), ctrl.fetch)

routerMedia.post(
    '/',
    checkPermission(permissionCodes.createMedia),
    validate(schemas.post),
    ctrl.create,
)

routerMedia.get(
    '/:id',
    checkPermission(permissionCodes.viewDetailsOfMedia),
    validate(schemas.idGet),
    ctrl.get,
)
routerMedia.put(
    '/:id',
    checkPermission(permissionCodes.updateMedia),
    validate(schemas.idPut),
    ctrl.update,
)
routerMedia.del(
    '/:id',
    checkPermission(permissionCodes.deleteMedia),
    validate(schemas.idDelete),
    ctrl.delete,
)

module.exports = [routerMedia]

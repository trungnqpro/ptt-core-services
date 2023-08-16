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

const routerAlbum = new Router({ prefix: '/albums' })
routerAlbum.use(auth)

routerAlbum.get('/', checkPermission(permissionCodes.listAlbum), validate(schemas.get), ctrl.fetch)

routerAlbum.post(
    '/',
    checkPermission(permissionCodes.createAlbum),
    validate(schemas.post),
    ctrl.create,
)

routerAlbum.get(
    '/:id',
    checkPermission(permissionCodes.viewDetailsOfAlbum),
    validate(schemas.idGet),
    ctrl.get,
)
routerAlbum.put(
    '/:id',
    checkPermission(permissionCodes.updateAlbum),
    validate(schemas.idPut),
    ctrl.update,
)
routerAlbum.del(
    '/:id',
    checkPermission(permissionCodes.deleteAlbum),
    validate(schemas.idDelete),
    ctrl.delete,
)

module.exports = [routerAlbum]

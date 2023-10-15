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

const routerObjectMore = new Router({ prefix: '/object-mores' })
routerObjectMore.use(auth)

routerObjectMore.get(
    '/',
    checkPermission(permissionCodes.listObjectMore),
    validate(schemas.get),
    ctrl.fetch,
)

routerObjectMore.post(
    '/',
    checkPermission(permissionCodes.createObjectMore),
    validate(schemas.post),
    ctrl.create,
)

routerObjectMore.get(
    '/:id',
    checkPermission(permissionCodes.viewDetailsOfObjectMore),
    validate(schemas.idGet),
    ctrl.get,
)

routerObjectMore.get(
    '/source/:id',
    checkPermission(permissionCodes.listObjectMore),
    validate(schemas.idGet),
    ctrl.fetchBySourceId,
)

routerObjectMore.put(
    '/:id',
    checkPermission(permissionCodes.updateObjectMore),
    validate(schemas.idPut),
    ctrl.update,
)
routerObjectMore.del(
    '/:id',
    checkPermission(permissionCodes.deleteObjectMore),
    validate(schemas.idDelete),
    ctrl.delete,
)

module.exports = [routerObjectMore]

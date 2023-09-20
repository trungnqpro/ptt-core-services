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

const routerBtl86Post = new Router({ prefix: '/btl86-memories' })
routerBtl86Post.use(auth)

routerBtl86Post.get('/', checkPermission(permissionCodes.listBtl86Post), validate(schemas.get), ctrl.fetch)

routerBtl86Post.post(
    '/',
    checkPermission(permissionCodes.createBtl86Post),
    validate(schemas.post),
    ctrl.create,
)

routerBtl86Post.get(
    '/:id',
    checkPermission(permissionCodes.viewDetailsOfBtl86Post),
    validate(schemas.idGet),
    ctrl.get,
)
routerBtl86Post.put(
    '/:id',
    checkPermission(permissionCodes.updateBtl86Post),
    validate(schemas.idPut),
    ctrl.update,
)
routerBtl86Post.del(
    '/:id',
    checkPermission(permissionCodes.deleteBtl86Post),
    validate(schemas.idDelete),
    ctrl.delete,
)

module.exports = [routerBtl86Post]

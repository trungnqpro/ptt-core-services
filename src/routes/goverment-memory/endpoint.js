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

const routerGovermentPost = new Router({ prefix: '/goverment-memories' })
routerGovermentPost.use(auth)

routerGovermentPost.get('/', checkPermission(permissionCodes.listGovermentPost), validate(schemas.get), ctrl.fetch)

routerGovermentPost.post(
    '/',
    checkPermission(permissionCodes.createGovermentPost),
    validate(schemas.post),
    ctrl.create,
)

routerGovermentPost.get(
    '/:id',
    checkPermission(permissionCodes.viewDetailsOfGovermentPost),
    validate(schemas.idGet),
    ctrl.get,
)
routerGovermentPost.put(
    '/:id',
    checkPermission(permissionCodes.updateGovermentPost),
    validate(schemas.idPut),
    ctrl.update,
)
routerGovermentPost.del(
    '/:id',
    checkPermission(permissionCodes.deleteGovermentPost),
    validate(schemas.idDelete),
    ctrl.delete,
)

module.exports = [routerGovermentPost]

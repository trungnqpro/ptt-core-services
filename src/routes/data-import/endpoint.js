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

const routerFileUpload = new Router({ prefix: '/file-uploads' })
routerFileUpload.use(auth)

routerFileUpload.get('/', checkPermission(permissionCodes.listFileUpload), validate(schemas.get), ctrl.fetch)

routerFileUpload.post(
    '/',
    checkPermission(permissionCodes.createFileUpload),
    validate(schemas.post),
    ctrl.create,
)

routerFileUpload.get(
    '/:id',
    checkPermission(permissionCodes.viewDetailsOfFileUpload),
    validate(schemas.idGet),
    ctrl.get,
)
routerFileUpload.put(
    '/:id',
    checkPermission(permissionCodes.updateFileUpload),
    validate(schemas.idPut),
    ctrl.update,
)
routerFileUpload.del(
    '/:id',
    checkPermission(permissionCodes.deleteFileUpload),
    validate(schemas.idDelete),
    ctrl.delete,
)

module.exports = [routerFileUpload]

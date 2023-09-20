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

const routerDocumentType = new Router({ prefix: '/documentary-type' })
routerDocumentType.use(auth)

routerDocumentType.get('/', checkPermission(permissionCodes.listDocumentType), validate(schemas.get), ctrl.fetch)

routerDocumentType.post(
    '/',
    checkPermission(permissionCodes.createDocumentType),
    validate(schemas.post),
    ctrl.create,
)

routerDocumentType.get(
    '/:id',
    checkPermission(permissionCodes.viewDetailsOfDocumentType),
    validate(schemas.idGet),
    ctrl.get,
)
routerDocumentType.put(
    '/:id',
    checkPermission(permissionCodes.updateDocumentType),
    validate(schemas.idPut),
    ctrl.update,
)
routerDocumentType.del(
    '/:id',
    checkPermission(permissionCodes.deleteDocumentType),
    validate(schemas.idDelete),
    ctrl.delete,
)

module.exports = [routerDocumentType]

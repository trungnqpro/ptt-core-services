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

const routerDocumentaryType = new Router({ prefix: '/documentary-type' })
routerDocumentaryType.use(auth)

routerDocumentaryType.get('/', checkPermission(permissionCodes.listDocumentaryType), validate(schemas.get), ctrl.fetch)

routerDocumentaryType.post(
    '/',
    checkPermission(permissionCodes.createDocumentaryType),
    validate(schemas.post),
    ctrl.create,
)

routerDocumentaryType.get(
    '/:id',
    checkPermission(permissionCodes.viewDetailsOfDocumentaryType),
    validate(schemas.idGet),
    ctrl.get,
)
routerDocumentaryType.put(
    '/:id',
    checkPermission(permissionCodes.updateDocumentaryType),
    validate(schemas.idPut),
    ctrl.update,
)
routerDocumentaryType.del(
    '/:id',
    checkPermission(permissionCodes.deleteDocumentaryType),
    validate(schemas.idDelete),
    ctrl.delete,
)

module.exports = [routerDocumentaryType]

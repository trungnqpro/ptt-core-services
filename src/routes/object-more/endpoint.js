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

const routerArtifact = new Router({ prefix: '/object-mores' })
routerArtifact.use(auth)

routerArtifact.get('/', checkPermission(permissionCodes.listArtifact), validate(schemas.get), ctrl.fetch)

routerArtifact.post(
    '/',
    checkPermission(permissionCodes.createArtifact),
    validate(schemas.post),
    ctrl.create,
)

routerArtifact.get(
    '/:id',
    checkPermission(permissionCodes.viewDetailsOfArtifact),
    validate(schemas.idGet),
    ctrl.get,
)
routerArtifact.put(
    '/:id',
    checkPermission(permissionCodes.updateArtifact),
    validate(schemas.idPut),
    ctrl.update,
)
routerArtifact.del(
    '/:id',
    checkPermission(permissionCodes.deleteArtifact),
    validate(schemas.idDelete),
    ctrl.delete,
)

module.exports = [routerArtifact]

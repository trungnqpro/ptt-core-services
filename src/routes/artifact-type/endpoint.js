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

const routerArtifactType = new Router({ prefix: '/artifact-types' })
routerArtifactType.use(auth)

routerArtifactType.get('/', checkPermission(permissionCodes.listArtifactType), validate(schemas.get), ctrl.fetch)

routerArtifactType.post(
    '/',
    checkPermission(permissionCodes.createArtifactType),
    validate(schemas.post),
    ctrl.create,
)

routerArtifactType.get(
    '/:id',
    checkPermission(permissionCodes.viewDetailsOfArtifactType),
    validate(schemas.idGet),
    ctrl.get,
)
routerArtifactType.put(
    '/:id',
    checkPermission(permissionCodes.updateArtifactType),
    validate(schemas.idPut),
    ctrl.update,
)
routerArtifactType.del(
    '/:id',
    checkPermission(permissionCodes.deleteArtifactType),
    validate(schemas.idDelete),
    ctrl.delete,
)

module.exports = [routerArtifactType]

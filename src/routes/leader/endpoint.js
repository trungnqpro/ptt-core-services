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

const routerLeader = new Router({ prefix: '/leaders' })
routerLeader.use(auth)

routerLeader.get('/', checkPermission(permissionCodes.listLeader), validate(schemas.get), ctrl.fetch)

routerLeader.post(
    '/',
    checkPermission(permissionCodes.createLeader),
    validate(schemas.post),
    ctrl.create,
)

routerLeader.get(
    '/:id',
    checkPermission(permissionCodes.viewDetailsOfLeader),
    validate(schemas.idGet),
    ctrl.get,
)
routerLeader.put(
    '/:id',
    checkPermission(permissionCodes.updateLeader),
    validate(schemas.idPut),
    ctrl.update,
)
routerLeader.del(
    '/:id',
    checkPermission(permissionCodes.deleteLeader),
    validate(schemas.idDelete),
    ctrl.delete,
)

module.exports = [routerLeader]

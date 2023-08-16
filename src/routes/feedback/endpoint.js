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

const routerFeedback = new Router({ prefix: '/feedbacks' })
routerFeedback.use(auth)

routerFeedback.get('/', checkPermission(permissionCodes.listFeedback), validate(schemas.get), ctrl.fetch)

routerFeedback.post(
    '/',
    checkPermission(permissionCodes.createFeedback),
    validate(schemas.post),
    ctrl.create,
)

routerFeedback.get(
    '/:id',
    checkPermission(permissionCodes.viewDetailsOfFeedback),
    validate(schemas.idGet),
    ctrl.get,
)
routerFeedback.put(
    '/:id',
    checkPermission(permissionCodes.updateFeedback),
    validate(schemas.idPut),
    ctrl.update,
)
routerFeedback.del(
    '/:id',
    checkPermission(permissionCodes.deleteFeedback),
    validate(schemas.idDelete),
    ctrl.delete,
)

module.exports = [routerFeedback]

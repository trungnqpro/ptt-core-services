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

const routerDepartment = new Router({ prefix: '/departments' })
routerDepartment.use(auth)

routerDepartment.get('/', checkPermission(permissionCodes.listDepartment), validate(schemas.get), ctrl.fetch)

routerDepartment.post(
    '/',
    checkPermission(permissionCodes.createDepartment),
    validate(schemas.post),
    ctrl.create,
)

routerDepartment.get(
    '/:id',
    checkPermission(permissionCodes.viewDetailsOfDepartment),
    validate(schemas.idGet),
    ctrl.get,
)
routerDepartment.put(
    '/:id',
    checkPermission(permissionCodes.updateDepartment),
    validate(schemas.idPut),
    ctrl.update,
)
routerDepartment.del(
    '/:id',
    checkPermission(permissionCodes.deleteDepartment),
    validate(schemas.idDelete),
    ctrl.delete,
)

module.exports = [routerDepartment]

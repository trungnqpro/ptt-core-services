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

const routerUser = new Router({ prefix: '/users' })
routerUser.use(auth)

routerUser.get('/', checkPermission(permissionCodes.listUser), validate(schemas.get), ctrl.fetch)

routerUser.post(
    '/',
    checkPermission(permissionCodes.createUser),
    validate(schemas.post),
    ctrl.create,
)

routerUser.get('/info', checkPermission(permissionCodes.viewDetailsOfUser), ctrl.info)

routerUser.get(
    '/:id',
    checkPermission(permissionCodes.viewDetailsOfUser),
    validate(schemas.idGet),
    ctrl.get,
)

routerUser.put(
    '/:id',
    checkPermission(permissionCodes.updateUser),
    validate(schemas.idPut),
    ctrl.update,
)
routerUser.del(
    '/:id',
    checkPermission(permissionCodes.deleteUser),
    validate(schemas.idDelete),
    ctrl.delete,
)

routerUser.put(
    '/:id/password',
    preventLog,
    checkPermission(permissionCodes.setPasswordOfUser),
    validate(schemas.resetPassword),
    ctrl.resetPassword,
) // reset password by user id

const routeProfile = new Router({ prefix: '/profile' })
routeProfile.use(auth)

routeProfile.put('/', validate(schemas.updateProfile), ctrl.updateMyProfile)
routeProfile.get('/', ctrl.getMyProfile)
routeProfile.put('/password', preventLog, validate(schemas.setMyPassword), ctrl.setMyPassword)

module.exports = [routerUser, routeProfile]

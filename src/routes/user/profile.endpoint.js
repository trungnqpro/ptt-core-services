const Router = require('@koa/router')
const {
    validateApiSchema: validate,
    validateAccessToken: auth,
    preventLog,
} = require('../../www/middleware')
const ctrl = require('./controller')
const schemas = require('./schema-api')

const routeProfile = new Router({ prefix: '/profile' })
routeProfile.use(auth)

routeProfile.put('/', validate(schemas.updateProfile), ctrl.updateMyProfile)
routeProfile.get('/', ctrl.getMyProfile)
routeProfile.put('/password', preventLog, validate(schemas.setMyPassword), ctrl.setMyPassword)

module.exports = routeProfile

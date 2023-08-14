const permissions = require('../../libs/permission')
const { Role } = require('../../configs/permissions').resources

module.exports = permissions.resource(Role).create().delete().update().list().done()

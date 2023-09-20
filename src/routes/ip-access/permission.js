const permissions = require('../../libs/permission')
const { ConfigHome } = require('../../configs/permissions').resources

module.exports = permissions
    .resource(ConfigHome)
    .create()
    .update()
    .viewDetailsOf()
    .delete()
    .list()
    .done()

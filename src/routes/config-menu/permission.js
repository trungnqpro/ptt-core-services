const permissions = require('../../libs/permission')
const { ConfigMenu } = require('../../configs/permissions').resources

module.exports = permissions
    .resource(ConfigMenu)
    .create()
    .update()
    .viewDetailsOf()
    .delete()
    .list()
    .done()

const permissions = require('../../libs/permission')
const { ConfigFolder } = require('../../configs/permissions').resources

module.exports = permissions
    .resource(ConfigFolder)
    .create()
    .update()
    .viewDetailsOf()
    .delete()
    .list()
    .done()

const permissions = require('../../libs/permission')
const { ConfigBackup } = require('../../configs/permissions').resources

module.exports = permissions
    .resource(ConfigBackup)
    .create()
    .update()
    .viewDetailsOf()
    .delete()
    .list()
    .done()

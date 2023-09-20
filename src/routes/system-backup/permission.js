const permissions = require('../../libs/permission')
const { SystemBackup } = require('../../configs/permissions').resources

module.exports = permissions
    .resource(SystemBackup)
    .create()
    .update()
    .viewDetailsOf()
    .delete()
    .list()
    .done()

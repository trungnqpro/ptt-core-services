const permissions = require('../../libs/permission')
const { SystemFolder } = require('../../configs/permissions').resources

module.exports = permissions
    .resource(SystemFolder)
    .create()
    .update()
    .viewDetailsOf()
    .delete()
    .list()
    .done()

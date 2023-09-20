const permissions = require('../../libs/permission')
const { SystemRestore } = require('../../configs/permissions').resources

module.exports = permissions
    .resource(SystemRestore)
    .create()
    .update()
    .viewDetailsOf()
    .delete()
    .list()
    .done()

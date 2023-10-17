const permissions = require('../../libs/permission')
const { SystemLog } = require('../../configs/permissions').resources

module.exports = permissions
    .resource(SystemLog)
    .create()
    .update()
    .viewDetailsOf()
    .delete()
    .list()
    .done()

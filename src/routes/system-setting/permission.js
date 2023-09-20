const permissions = require('../../libs/permission')
const { SystemSetting } = require('../../configs/permissions').resources

module.exports = permissions
    .resource(SystemSetting)
    .create()
    .update()
    .viewDetailsOf()
    .delete()
    .list()
    .done()

const permissions = require('../../libs/permission')
const { SystemRoute } = require('../../configs/permissions').resources

module.exports = permissions
    .resource(SystemRoute)
    .create()
    .update()
    .viewDetailsOf()
    .delete()
    .list()
    .done()

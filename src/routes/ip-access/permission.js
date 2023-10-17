const permissions = require('../../libs/permission')
const { IpAccess } = require('../../configs/permissions').resources

module.exports = permissions
    .resource(IpAccess)
    .create()
    .update()
    .viewDetailsOf()
    .delete()
    .list()
    .done()

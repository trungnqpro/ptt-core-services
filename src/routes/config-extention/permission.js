const permissions = require('../../libs/permission')
const { ConfigExtention } = require('../../configs/permissions').resources

module.exports = permissions
    .resource(ConfigExtention)
    .create()
    .update()
    .viewDetailsOf()
    .delete()
    .list()
    .done()

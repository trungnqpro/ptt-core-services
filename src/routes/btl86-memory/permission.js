const permissions = require('../../libs/permission')
const { Btl86Memory } = require('../../configs/permissions').resources

module.exports = permissions
    .resource(Btl86Memory)
    .create()
    .update()
    .viewDetailsOf()
    .delete()
    .list()
    .done()

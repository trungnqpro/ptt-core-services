const permissions = require('../../libs/permission')
const { Btl86Post } = require('../../configs/permissions').resources

module.exports = permissions
    .resource(Btl86Post)
    .create()
    .update()
    .viewDetailsOf()
    .delete()
    .list()
    .done()

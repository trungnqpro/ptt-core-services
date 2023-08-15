const permissions = require('../../libs/permission')
const { Leader } = require('../../configs/permissions').resources

module.exports = permissions
    .resource(Leader)
    .create()
    .update()
    .viewDetailsOf()
    .delete()
    .list()
    .done()

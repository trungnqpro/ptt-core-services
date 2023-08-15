const permissions = require('../../libs/permission')
const { Badge } = require('../../configs/permissions').resources

module.exports = permissions
    .resource(Badge)
    .create()
    .update()
    .viewDetailsOf()
    .delete()
    .list()
    .done()

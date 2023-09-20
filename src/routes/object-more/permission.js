const permissions = require('../../libs/permission')
const { ObjectMore } = require('../../configs/permissions').resources

module.exports = permissions
    .resource(ObjectMore)
    .create()
    .update()
    .viewDetailsOf()
    .delete()
    .list()
    .done()

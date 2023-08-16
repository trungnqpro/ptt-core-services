const permissions = require('../../libs/permission')
const { Reaction } = require('../../configs/permissions').resources

module.exports = permissions
    .resource(Reaction)
    .create()
    .update()
    .viewDetailsOf()
    .delete()
    .list()
    .done()

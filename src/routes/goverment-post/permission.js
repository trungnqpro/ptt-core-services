const permissions = require('../../libs/permission')
const { GovermentPost } = require('../../configs/permissions').resources

module.exports = permissions
    .resource(GovermentPost)
    .create()
    .update()
    .viewDetailsOf()
    .delete()
    .list()
    .done()

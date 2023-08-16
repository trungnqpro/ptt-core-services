const permissions = require('../../libs/permission')
const { Media } = require('../../configs/permissions').resources

module.exports = permissions
    .resource(Media)
    .create()
    .update()
    .viewDetailsOf()
    .delete()
    .list()
    .done()

const permissions = require('../../libs/permission')
const { Album } = require('../../configs/permissions').resources

module.exports = permissions
    .resource(Album)
    .create()
    .update()
    .viewDetailsOf()
    .delete()
    .list()
    .done()

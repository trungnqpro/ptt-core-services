const permissions = require('../../libs/permission')
const { Artifact } = require('../../configs/permissions').resources

module.exports = permissions
    .resource(Artifact)
    .create()
    .update()
    .viewDetailsOf()
    .delete()
    .list()
    .done()

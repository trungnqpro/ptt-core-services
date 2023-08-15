const permissions = require('../../libs/permission')
const { ArtifactType } = require('../../configs/permissions').resources

module.exports = permissions
    .resource(ArtifactType)
    .create()
    .update()
    .viewDetailsOf()
    .delete()
    .list()
    .done()

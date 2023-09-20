const permissions = require('../../libs/permission')
const { DocumentaryType } = require('../../configs/permissions').resources

module.exports = permissions
    .resource(DocumentaryType)
    .create()
    .update()
    .viewDetailsOf()
    .delete()
    .list()
    .done()

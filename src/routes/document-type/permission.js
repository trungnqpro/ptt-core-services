const permissions = require('../../libs/permission')
const { DocumentType } = require('../../configs/permissions').resources

module.exports = permissions
    .resource(DocumentType)
    .create()
    .update()
    .viewDetailsOf()
    .delete()
    .list()
    .done()

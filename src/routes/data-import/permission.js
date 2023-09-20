const permissions = require('../../libs/permission')
const { FileUpload } = require('../../configs/permissions').resources

module.exports = permissions
    .resource(FileUpload)
    .create()
    .update()
    .viewDetailsOf()
    .delete()
    .list()
    .done()

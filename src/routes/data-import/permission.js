const permissions = require('../../libs/permission')
const { DataImport } = require('../../configs/permissions').resources

module.exports = permissions
    .resource(DataImport)
    .create()
    .update()
    .viewDetailsOf()
    .delete()
    .list()
    .done()

const permissions = require('../../libs/permission')
const { Department } = require('../../configs/permissions').resources

module.exports = permissions
    .resource(Department)
    .create()
    .update()
    .viewDetailsOf()
    .delete()
    .list()
    .done()

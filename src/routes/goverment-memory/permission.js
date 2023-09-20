const permissions = require('../../libs/permission')
const { GovermentMemory } = require('../../configs/permissions').resources

module.exports = permissions
    .resource(GovermentMemory)
    .create()
    .update()
    .viewDetailsOf()
    .delete()
    .list()
    .done()

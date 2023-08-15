const permissions = require('../../libs/permission')
const { Position } = require('../../configs/permissions').resources

module.exports = permissions
    .resource(Position)
    .create()
    .update()
    .viewDetailsOf()
    .delete()
    .list()
    .done()

const permissions = require('../../libs/permission')
const { Feedback } = require('../../configs/permissions').resources

module.exports = permissions
    .resource(Feedback)
    .create()
    .update()
    .viewDetailsOf()
    .delete()
    .list()
    .done()

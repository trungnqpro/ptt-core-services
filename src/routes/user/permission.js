const permissions = require('../../libs/permission')
const { User } = require('../../configs/permissions').resources

module.exports = permissions
    .resource(User)
    .create()
    .update()
    .viewDetailsOf()
    .delete()
    .list()
    .customPermissions([
        {
            actionCode: '20',
            actionName: 'setPasswordOf',
        },
    ])
    .done()

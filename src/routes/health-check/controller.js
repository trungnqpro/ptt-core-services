exports.healthCheck = async ctx => {
    ctx.body = {
        isConnectedToDb: true,
    }
}

const { libs, resources } = require('../../root')

const { Media } = resources
const { ValidationError } = libs.errors

exports.upload = async ctx => {
    // const { user } = ctx.state

    let mediaFiles = ctx.request.files.files

    if (!mediaFiles) {
        throw new ValidationError('File upload is required.')
    }

    mediaFiles = mediaFiles.path ? [mediaFiles] : mediaFiles

    ctx.body = await Media.Service.upload(mediaFiles)
}
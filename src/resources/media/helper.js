const path = require('path')
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path
const ffmpeg = require('fluent-ffmpeg')
ffmpeg.setFfmpegPath(ffmpegPath)

const { S3_PROTOCOL, S3_ENDPOINT, S3_BUCKET_NAME } = process.env

exports.generateThumbnail = (filepath, filename) => {
    const basename = path.basename(filename, path.extname(filename))

    return new Promise((resolve, reject) => {
        ffmpeg(filepath)
            .on('error', err => {
                reject(err)
            })
            .on('end', () => {
                resolve(basename)
            })
            .screenshots({
                timemarks: ['00:00:00.000'],
                folder: process.env.UPLOAD_DIR,
                filename: `${basename}.png`,
            })
    })
}

exports.getUrl = path =>
    !path || /(data|http|https):.*/.test(path)
        ? path
        : `${S3_PROTOCOL}://${S3_ENDPOINT}/${S3_BUCKET_NAME}/${path}`

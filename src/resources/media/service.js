const mime = require('mime')
const Jimp = require('jimp')
const path = require('path')
const fs = require('fs')
const Promise = require('bluebird')
const uuidv4 = require('uuid').v4
const NodeCache = require('node-cache')
const moment = require('moment')
const { URL } = require('url')
const crypto = require('crypto')

const debug = require('../../libs/debug')()
const { MEDIA_TYPE } = require('./static')
const MediaHelper = require('./helper')

exports.upload = async mediaFiles => {
    return Promise.map(
        mediaFiles,
        async e => {
            // get type
            const mimetype = mime.getType(e.name)
            const type = this.getType(e.name)

            const filePath = e.path
            const filename = path.basename(filePath).replace('upload_', '')

            debug.info(`Start to upload ${filename}...`)

            if (!filePath) {
                return {}
            }

            let width, height

            if (type === MEDIA_TYPE.IMAGE) {
                try {
                    const image = await Jimp.read(filePath)

                    width = image.bitmap.width
                    height = image.bitmap.height
                } catch (error) {
                    width = 0
                    height = 0
                    debug.warn(error)
                }
            } else if (type === MEDIA_TYPE.VIDEO) {
                const thumbnailName = await MediaHelper.generateThumbnail(filePath, filename)
                const thumbPath = path.join(process.env.UPLOAD_DIR, `${thumbnailName}.png`)
                const image = await Jimp.read(thumbPath)
                width = image.bitmap.width
                height = image.bitmap.height
            } else if (type === MEDIA_TYPE.AUDIO) {
                // do st
            }

            // create directory by time YYYY -> MM
            const now = new Date()
            const folder = `${now.getFullYear()}/${type}`
            const directoryPrefix = `${process.env.UPLOAD_DIR}/${folder}`
            if (!fs.existsSync(directoryPrefix)) {
                fs.mkdirSync(directoryPrefix, { recursive: true })
            }

            // move to directory
            const savedFilename = `${directoryPrefix}/${filename}`
            fs.copyFile(filePath, savedFilename, fs.constants.COPYFILE_EXCL, err => {
                // unlink file upload from temp
                fs.unlink(filePath, err => {
                    if (err) {
                        debug.error('Cannot remove media file', err)
                    }
                })

                if (err) {
                    debug.error(`Upload ${filename} into ${directoryPrefix} failed: ${err}`)
                    return
                }
                debug.info(`Uploaded ${filename} into ${directoryPrefix} succeded!`)
            })

            return {
                name: e.name,
                type,
                size: e.size,
                width,
                height,
                url: `${process.env.BASE_URL}/${savedFilename}`,
            }
        },
        { concurrency: 10 },
    )
}

exports.getType = fileName => {
    const mimetype = mime.getType(fileName)
    let type = mimetype
    if (/^image\/.*/.test(type)) type = MEDIA_TYPE.IMAGE
    else if (/^video\/.*/.test(type)) type = MEDIA_TYPE.VIDEO
    else if (/^audio\/.*/.test(type)) type = MEDIA_TYPE.AUDIO
    else type = MEDIA_TYPE.FILE

    return type
}

exports.getExt = fileName => {
    return path.extname(fileName)
}

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
const s3 = require('../../connections/s3')
const { MEDIA_TYPE } = require('./static')

const {
    S3_PROTOCOL,
    S3_ENDPOINT,
    S3_BUCKET_NAME,
    S3_ENDPOINT_MASK,
    S3_CDN_URL,
    S3_CDN_SECRET_KEY,
} = process.env
const S3_CDN_INCLUDED_BUCKET = !!parseInt(process.env.S3_CDN_INCLUDED_BUCKET || '1')
const domains = process.env.S3_DOMAIN_LIST.split('|').filter(e => !!e)
const regexPath = /shared\/.+/
const domainRegex = domains.map(domain => {
    const fixDomain = domain.replace(/\./g, '\\.')
    const formular = `${S3_PROTOCOL}:\\/\\/${fixDomain}\\/(${S3_BUCKET_NAME}|sapp-lms|sapp-prod)\\/.+`
    const regexEndpoint = new RegExp(formular, 'g')
    return regexEndpoint
})
const ttlSignedUrl = parseInt(process.env.S3_SIGNED_URL_EXPIRES, 10) // seconds

const MEMORY_CACHE_TTL = 10 * 60 // 10 minute
// const RD_TTL = '10m' // 10 minutes

const memoryCache = new NodeCache({
    stdTTL: MEMORY_CACHE_TTL,
    checkperiod: 60,
    useClones: true, // able multi keys refers to a object (not clone)
})

exports.getSignedUrlRead = async s3Key => {
    const s3FilePath = s3Key.replace('sapp-prod/', `${S3_BUCKET_NAME}/`)
    if (!s3FilePath) {
        return
    }

    let match = false

    domains.forEach(domain => {
        const fixDomain = domain.replace(/\./g, '\\.')
        const testEndpoint = `${S3_PROTOCOL}:\\/\\/${fixDomain}\\/(${S3_BUCKET_NAME}|sapp-lms|sapp-prod)\\/.+`
        const regexEndpoint = new RegExp(testEndpoint, 'g')
        const ok = regexEndpoint.test(s3FilePath)
        if (ok) {
            match = true
        }
    })

    const isPath = regexPath.test(s3FilePath)
    if (isPath) {
        match = true
    }

    if (!match) {
        return s3FilePath
    }

    let url = memoryCache.get(s3FilePath)

    if (!url) {
        let key = s3FilePath
        domains.forEach(domain => {
            const fixDomain = domain.replace(/\./g, '\\.')
            const testEndpoint = `${S3_PROTOCOL}:\\/\\/${fixDomain}\\/(${S3_BUCKET_NAME}|sapp-lms|sapp-prod)\\/`
            const regexEndpoint = new RegExp(testEndpoint)
            key = key.replace(regexEndpoint, '')
            const testEndpointWithoutBucket = `${S3_PROTOCOL}:\\/\\/${fixDomain}\\/`
            const regexEndpointWithoutBucket = new RegExp(testEndpointWithoutBucket)
            key = key.replace(regexEndpointWithoutBucket, '')
        })

        key = key.replace(/\?.*/, '')

        // get type
        const mimetype = mime.getType(key)

        url = await s3.getSignedUrlRead(key)

        if (/^video\/.*/.test(mimetype)) {
            domains.forEach(domain => {
                url = url.replace(domain, S3_CDN_URL)
                if (S3_CDN_INCLUDED_BUCKET) {
                    url = url.replace(new RegExp(`\\/${S3_BUCKET_NAME}|sapp-lms|sapp-prod`), '')
                }
            })

            // thêm tham số cho Bizfly CDN
            if (url.includes(S3_CDN_URL)) {
                const e = moment().unix() + ttlSignedUrl // add 15 minutes = 15 * 60 seconds
                const urlObj = new URL(url)
                const signaturalText = `${e}|${urlObj.pathname}`
                let s = crypto
                    .createHmac('sha1', S3_CDN_SECRET_KEY)
                    .update(signaturalText)
                    .digest()
                    .toString('base64')
                s = s.replace(/\+/g, '-').replace(/\//g, '_')

                url += (urlObj.search ? '&' : '?') + `s=${s}&e=${e}`
            }
        }

        memoryCache.set(s3FilePath, url)
    }

    return url
}

// const MediaHelper = require('./helper')

exports.upload = async mediaFiles => {
    return Promise.map(
        mediaFiles,
        async e => {
            // get type
            const mimetype = mime.getType(e.name)
            const type = this.getType(e.name)

            const filePath = e.path
            const filename = path.basename(filePath).replace('upload_', '')

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
                // const thumbnailName = await MediaHelper.generateThumbnail(filepath, filename)
                // const thumbPath = path.join(process.env.UPLOAD_DIR, `${thumbnailName}.png`)
                // const image = await Jimp.read(thumbPath)
                // width = image.bitmap.width
                // height = image.bitmap.height
            }

            const s3Area = `shared/${type}s`
            await s3.push(s3Area, filename, filePath, e.name, mimetype)

            fs.unlink(filePath, err => {
                if (err) {
                    debug.error('Cannot remove media file', err)
                }
            })

            // save into redis to reuse in other modules
            return {
                name: e.name,
                type,
                size: e.size,
                width,
                height,
                path: `${s3Area}/${filename}`,
                url: `${S3_PROTOCOL}://${
                    S3_ENDPOINT_MASK || S3_ENDPOINT
                }/${S3_BUCKET_NAME}/${s3Area}/${filename}`,
            }
        },
        { concurrency: 10 },
    )
}

exports.getSignedUrl = async fileName => {
    // get type
    const mimetype = mime.getType(fileName)
    const ext = path.extname(fileName)
    const type = this.getType(fileName)

    const s3Area = `shared/${type}s`
    const s3FileName = uuidv4() + ext
    const acl = 'public-read'

    const signedUrl = await s3.getSignedUrl(s3FileName, mimetype, s3Area, fileName, acl)

    const result = {
        signedUrl,
        url: `${S3_PROTOCOL}://${S3_ENDPOINT}/${S3_BUCKET_NAME}/${s3Area}/${s3FileName}`,
        fileName,
        path: `${s3Area}/${s3FileName}`,
        contentType: mimetype,
        acl,
    }

    return result
}

exports.createMultipartUpload = async fileName => {
    // get type
    const mimetype = mime.getType(fileName)
    const ext = path.extname(fileName)
    const type = this.getType(fileName)

    const s3Area = `shared/${type}s`
    const s3FileName = uuidv4() + ext
    const acl = 'public-read'
    const uploadData = await s3.createMultipartUpload(s3FileName, mimetype, s3Area, fileName, acl)

    const result = {
        uploadId: uploadData.UploadId,
        url: `${S3_PROTOCOL}://${S3_ENDPOINT}/${S3_BUCKET_NAME}/${s3Area}/${s3FileName}`,
        fileName,
        path: `${s3Area}/${s3FileName}`,
        contentType: mimetype,
        acl,
    }

    return result
}

exports.getSignedUrlPart = async (partNumber, path, uploadId) => {
    const signedUrl = await s3.getSignedUrlPart(partNumber, path, uploadId)

    return signedUrl
}

exports.getMultipartToUpload = async (fileName, totalPart) => {
    // get type
    const mimetype = mime.getType(fileName)
    const ext = path.extname(fileName)
    const type = this.getType(fileName)

    const s3Area = `shared/${type}s`
    const s3FileName = uuidv4() + ext
    const acl = 'public-read'
    const parts = Array.from({ length: totalPart }, (_, i) => i + 1) // [1, 2, 3, ...]

    const uploadData = await s3.createMultipartUpload(s3FileName, mimetype, s3Area, fileName, acl)

    const signedUrls = await Promise.map(
        parts,
        partNumber => s3.getSignedUrlPart(partNumber, uploadData.Key, uploadData.UploadId),
        { concurrency: 10 },
    )

    const result = {
        uploadId: uploadData.UploadId,
        signedUrls,
        url: `${S3_PROTOCOL}://${S3_ENDPOINT}/${S3_BUCKET_NAME}/${s3Area}/${s3FileName}`,
        fileName,
        path: `${s3Area}/${s3FileName}`,
        contentType: mimetype,
        acl,
    }

    return result
}

exports.completeUpload = async (uploadId, path, parts) => {
    const result = await s3.completeUpload(uploadId, path, parts)

    return result
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

// exports.getSignedUrlRead = async s3FilePath => {
//     if (!s3FilePath) {
//         return
//     }

//     let key = s3FilePath
//     key = key
//         .replace(`${S3_PROTOCOL}://${S3_ENDPOINT_MASK}/${S3_BUCKET_NAME}/`, '')
//         .replace(`${S3_PROTOCOL}://${S3_ENDPOINT}/${S3_BUCKET_NAME}/`, '')
//         .replace(`${S3_PROTOCOL}://${S3_CDN_URL}/${S3_BUCKET_NAME}/`, '')
//         .replace(/\?.*/, '')

//     // get type
//     const mimetype = mime.getType(s3FilePath)

//     const signedUrl = await s3.getSignedUrlRead(key)

//     if (/^video\/.*/.test(mimetype)) {
//         let akamaiUrl = signedUrl
//         if (S3_ENDPOINT_MASK) {
//             akamaiUrl = akamaiUrl.replace(S3_ENDPOINT_MASK, S3_CDN_URL)
//         }
//         if (S3_ENDPOINT) {
//             akamaiUrl = akamaiUrl.replace(S3_ENDPOINT, S3_CDN_URL)
//         }

//         return akamaiUrl
//     }

//     return signedUrl
// }

exports.scanMediaUrls = (result = {}, entity, path, fixedKeys = [], key) => {
    if (!entity) {
        return
    }
    if (Array.isArray(entity)) {
        for (let i = 0; i < entity.length; i++) {
            this.scanMediaUrls(result, entity[i], `${path}[${i}]`, fixedKeys)
        }
    } else if (typeof entity === 'object') {
        const keys = Object.keys(entity)
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i]
            // if (fixedKeys.includes(key)) {
            //     this.scanMediaUrls(result, entity[key], `${path}['${key}']`, fixedKeys)
            // }
            this.scanMediaUrls(result, entity[key], `${path}['${key}']`, fixedKeys, key)
        }
    } else if (typeof entity === 'string') {
        if (!fixedKeys.includes(key)) {
            return
        }
        let found = false

        domainRegex.forEach(regexEndpoint => {
            if (regexEndpoint.test(entity)) {
                found = true
            }
        })

        const isPath = regexPath.test(entity)

        if (isPath) {
            found = true
        }

        if (found) {
            result[path] = entity
        }
    }
}

exports.scanFieldContentMediaUrl = (result = {}, entity, path, fixedKeys = [], key) => {
    if (!entity) {
        return
    }
    if (Array.isArray(entity)) {
        for (let i = 0; i < entity.length; i++) {
            this.scanMediaUrls(result, entity[i], `${path}[${i}]`, fixedKeys)
        }
    } else if (typeof entity === 'object') {
        const keys = Object.keys(entity)
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i]
            // if (fixedKeys.includes(key)) {
            //     this.scanMediaUrls(result, entity[key], `${path}['${key}']`, fixedKeys)
            // }
            this.scanMediaUrls(result, entity[key], `${path}['${key}']`, fixedKeys, key)
        }
    } else if (typeof entity === 'string') {
        let found = false

        domains.forEach(domain => {
            const fixDomain = domain.replace(/\./g, '\\.')
            const strTest = `.*${S3_PROTOCOL}:\\/\\/${fixDomain}\\/(${S3_BUCKET_NAME}|sapp-lms|sapp-prod)\\/.+`
            const regex = new RegExp(strTest, 'g')
            if (regex.test(entity)) {
                found = true
            }
        })

        if (fixedKeys.includes(key) && found) {
            result[path] = entity
        }
    }
}

exports.convertUrlInContentToCdn = async content => {
    let newContent = content
    let links = []

    domains.forEach(domain => {
        const fixDomain = domain.replace(/\./g, '\\.')
        const testEndpoint = `src\\s*=\\s*"${S3_PROTOCOL}:\\/\\/${fixDomain}\\/(${S3_BUCKET_NAME}|sapp-lms|sapp-prod)\\/.+?"`
        const regexEndpoint = new RegExp(testEndpoint, 'g')
        let sources = newContent.match(regexEndpoint) || []
        sources = sources.map(e => e.replace(/src\s*=\s*"/, '').replace('"', ''))
        links.push(...sources)
    })

    links = Array.from(new Set(links))

    const signedUrls = await Promise.map(links, this.getSignedUrlRead, { concurrency: 10 })

    links.forEach((link, i) => {
        newContent = newContent.split(link).join(signedUrls[i])
    })

    return newContent
}

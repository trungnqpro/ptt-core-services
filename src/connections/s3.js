/**
 * @fileoverview Module thực hiện tương tác với S3.
 *
 * @module connections/s3
 */
const AWS = require('aws-sdk')
const fs = require('fs')
const contentDisposition = require('content-disposition')
const util = require('util')
// TODO stream: https://www.npmjs.com/package/s3-upload-stream

const endpoint = new AWS.Endpoint(process.env.S3_ENDPOINT)
const s3 = new AWS.S3({
    accessKeyId: process.env.S3_PRIVATE_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
    endpoint,
    s3ForcePathStyle: true,
    // s3BucketEndpoint: false,
})

const putObject = util.promisify(s3.putObject).bind(s3)
const createMultipartUploadPromise = util.promisify(s3.createMultipartUpload).bind(s3)
const completeUpload = util.promisify(s3.completeMultipartUpload).bind(s3)
const BUCKET_NAME = process.env.S3_BUCKET_NAME
const ttlSignedUrl = parseInt(process.env.S3_SIGNED_URL_EXPIRES, 10) // seconds

/**
 * Upload file lên S3 (thông qua server). Client tải file lên server sau đó upload file từ server lên S3).
 *
 * @function push
 * @async
 * @static
 *
 * @param {String} folder S3 folder.
 * @param {String} filename S3 file name.
 * @param {String} filePath Loal file path.
 * @param {String} originalFilename Original file name.
 * @param {String} contentType Content type of file
 */
exports.push = (folder, filename, filePath, originalFilename, contentType) => {
    const data = fs.readFileSync(filePath)
    const disposition = contentDisposition(filePath)

    const params = {
        Bucket: BUCKET_NAME,
        Key: `${folder}/${filename}`,
        Body: data,
        // ACL: 'public-read',
    }

    if (!contentType?.includes('image')) {
        params.ContentDisposition = disposition
    }

    if (contentType) {
        params.ContentType = contentType
    }

    return putObject(params)
}

/**
 * Lấy link s3 đã được kí.
 *
 * @function push
 * @async
 * @static
 *
 * @param {String} filename S3 file name.
 * @param {String} contentType Content type of file
 * @param {String} folder S3 folder.
 * @param {String} originalFilename Original file name.
 * @param {String} [acl='public-read'] S3 acl.
 *
 * @returns {String} Signed url
 */
exports.getSignedUrl = (fileName, contentType, folder, originalFilename, acl = 'public-read') => {
    const s3Params = {
        Bucket: BUCKET_NAME,
        Expires: ttlSignedUrl,
        // ACL: acl,
        Key: `${folder}/${fileName}`,
        ContentType: contentType,
        // ContentDisposition: 'attachment; filename ="' + originalFilename + '"',
    }

    return s3.getSignedUrlPromise('putObject', s3Params)
}

/**
 * Lấy link s3 đã được kí.
 *
 * @async
 * @static
 *
 * @param {String} key S3 file path.
 *
 * @returns {String} Signed url
 */
exports.getSignedUrlRead = key => {
    const s3Params = {
        Bucket: BUCKET_NAME,
        Expires: ttlSignedUrl,
        Key: key,
    }

    return s3.getSignedUrlPromise('getObject', s3Params)
}

/**
 * Lấy upload id từ S3 để sử dụng trong việc upload file theo nhiều part.
 * Sử dụng trong trường hợp upload các file có dung lượng lớn.
 *
 * @function createMultipartUpload
 * @async
 * @static
 *
 * @param {String} fileName S3 file name.
 * @param {String} contentType Content type of file.
 * @param {String} folder S3 folder.
 * @param {String} originalFilename Original file name.
 * @param {String} [acl= 'public-read'] S3 acl.
 *
 * @returns {Object} Trả về object chứa upload id {UploadId: String, ...}
 */
exports.createMultipartUpload = async (
    fileName,
    contentType,
    folder,
    originalFilename,
    acl = 'public-read',
) => {
    const params = {
        Bucket: BUCKET_NAME,
        Expires: ttlSignedUrl,
        // ACL: acl,
        Key: `${folder}/${fileName}`,
        ContentType: contentType,
        // ContentDisposition: 'attachment; filename ="' + originalFilename + '"',
    }

    const uploadData = await createMultipartUploadPromise(params) // response {UploadId, ...}

    return uploadData
}

/**
 * Yêu cầu S3 kí các part trước khi upload (sử dụng trong việc upload file theo nhiều part).
 *
 * @function getSignedUrlPart
 * @async
 * @static
 *
 * @param {Number} partNumber Số thứ tự của path (bắt đầu từ 1).
 * @param {String} path Đường dẫn đến file trên S3 (ví dụ: /folder/filename.img).
 * @param {String} uploadId Upload id.
 *
 * @returns {String} signed url
 */
exports.getSignedUrlPart = (partNumber, path, uploadId) => {
    const s3Params = {
        Bucket: BUCKET_NAME,
        Expires: ttlSignedUrl,
        Key: path,
        UploadId: uploadId,
        PartNumber: partNumber,
    }

    return s3.getSignedUrlPromise('uploadPart', s3Params)
}

/**
 * Thông báo cho S3 sau khi đã hoàn thành upload tất cả các part của file.
 *
 * @function completeUpload
 * @async
 * @static
 *
 * @param {String} uploadId Upload id.
 * @param {String} path Đường dẫn đến file trên S3 (ví dụ: /folder/filename.img).
 * @param {Number} partNumber Số thứ tự của path (bắt đầu từ 1).
 *
 * @returns {String} signed url
 */
exports.completeUpload = async (uploadId, path, parts) => {
    const s3Params = {
        Bucket: BUCKET_NAME,
        Key: path,
        MultipartUpload: {
            Parts: parts.map(e => ({
                ETag: e.eTag,
                PartNumber: e.partNumber,
            })),
        },
        UploadId: uploadId,
    }

    const result = await completeUpload(s3Params)

    return result
}

exports.listObjects = async (path, continuationToken) => {
    if (!path) {
        return
    }
    const params = {
        Bucket: BUCKET_NAME /* required */,
        MaxKeys: 1000,
        Delimiter: '/',
        Prefix: path, // Can be your folder name
    }
    if (continuationToken) {
        params.ContinuationToken = continuationToken
    }
    const files = await new Promise((resolve, reject) => {
        s3.listObjectsV2(params, function (err, data) {
            if (err) {
                console.log(err, err.stack)
                reject(err)
            } else {
                resolve(data)
            }
        })
    })

    // console.log(files.length)
    return files
}

exports.setObjectAclPrivate = async key => {
    const params = {
        Bucket: BUCKET_NAME /* required */,
        Key: key /* required */,
        ACL: 'private',
    }
    const result = await new Promise((resolve, reject) => {
        s3.putObjectAcl(params, function (err, data) {
            if (err) {
                console.log(err, err.stack)
                reject(err)
            } else {
                resolve(data)
            }
        })
    })

    // console.log(files.length)
    return result
}

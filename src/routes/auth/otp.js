const { authenticator } = require('otplib')
const qrcode = require('qrcode')
const fs = require('fs')

const { OTP_SECRET_KEY } = process.env

exports.generateQrcode = () => {
    const user = 'Admin'
    const service = 'BTL86'

    const otpauth = authenticator.keyuri(user, service, OTP_SECRET_KEY)

    return new Promise((resolve, reject) => {
        qrcode.toDataURL(otpauth, (err, imageUrl) => {
            if (err) {
                console.log('Error with QR')
                return reject(err)
            }
            const base64Image = imageUrl.split(';base64,').pop()
            fs.writeFile('qr.png', base64Image, { encoding: 'base64' }, err => {
                if (err) {
                    console.error(err)
                    reject(err)
                } else {
                    resolve('ok')
                }
            })
            // console.log(imageUrl)
        })
    })
}

exports.getOtp = () => {
    if (!OTP_SECRET_KEY) {
        return
    }

    const token = authenticator.generate(OTP_SECRET_KEY)
    console.log(token)
}

exports.validateOtp = token => {
    if (!OTP_SECRET_KEY) {
        return
    }

    const result = authenticator.check(token, OTP_SECRET_KEY)
    return result
}

exports.generateSecret = () => {
    const secret = authenticator.generateSecret()
    console.log(secret)
}

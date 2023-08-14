/**
 * @fileoverview Module này thực hiện load danh sách permissions được khai báo trong các routes.
 * Cung cấp danh sách permission trong quá trình cài đặt role. (Cho phép/không cho phép một role nào đó
 * có quyền thực hiện một hành động nhất định lên một resource nào đó)
 *
 * @module configs/permissions
 */
const glob = require('glob')

const permissions = []
const permissionCodes = []

/**
 * Thực hiện load các cấu hình permissions trong tất cả các file permission.js
 * nằm trong các thư mục bên trong thư mục "routes"
 *
 * @async
 */
exports.load = async () => {
    // load permission
    return new Promise((resolve, reject) => {
        glob(
            `${__dirname}/../routes/*/**/permission.js`,
            // { ignore: '**/auth/*endpoint.js' },
            async (err, matches) => {
                if (err) {
                    reject(err)
                }

                for (let i = 0; i < matches.length; i += 1) {
                    const file = matches[i]
                    const apartOfPermissions = require(file) // eslint-disable-line global-require
                    permissions.push(...apartOfPermissions)
                }

                permissions.sort((a, b) => {
                    return a.no > b.no ? 1 : -1
                })

                permissionCodes.push(...permissions.map(e => e.code))

                resolve(permissions)
            },
        )
    })
}

exports.permissions = permissions
exports.permissionCodes = permissionCodes

/**
 * Danh sách resource.
 * Lưu ý: tên resource phải viết theo kiểu PascalCase - viết hoa các chữ cái đầu của mỗi từ và ở dạng số ít.
 */
const listResources = [
    // user
    'User',
    'Student',
    'Member',
    'Role',
    // study
    'Curriculum',
    'CertificateTemplate',
    'Certificate',
    'Subject',
    'SubjectUnit',
    'QuestionInBank',
    'StudyRegistration',
    'WordOfSpecializationDictionary',
    'LearningProgress',
    // support
    'RetentionTicket',
    'SubjectExtension',
    'SupportTemplate',
    'SupportTicket',
    'EntranceTestConfiguration',
    'MediaResource',
    'Announcement',
    'Quiz',
    'Survey',
    'Note',
    'Class',
    //Forum
    'Forum',
    'ForumTopic',
    'ForumReply',
]

const resources = {}
listResources.forEach(
    (name, idx) => (resources[name] = { no: ('0' + (idx + 1)).slice(-2), name: name }),
)

exports.resources = resources

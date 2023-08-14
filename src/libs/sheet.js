const XLSX = require('xlsx')
const { ValidationError } = require('./errors')
const ALPHABETS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

function transform(sheet, schema) {
    const ref = sheet['!ref']
    const [beginCell, endCell] = ref.split(':')
    const beginRow = parseInt(beginCell.replace(/[A-Z]*/g, ''), 10)
    const endRow = parseInt(endCell.replace(/[A-Z]*/g, ''), 10)
    const beginCol = beginCell.replace(/\d*/g, '')
    const endCol = endCell.replace(/\d*/g, '')

    const beginColIndex = convertColumnNameToNumber(beginCol)
    const endColIndex = convertColumnNameToNumber(endCol)
    const nameCols = []
    const mapColToField = {}

    for (let i = beginColIndex; i <= endColIndex; i += 1) {
        const nameCol = convertNumberToColumnName(i)
        nameCols.push(nameCol)
        const header = sheet[`${nameCol}1`]?.v?.trim()

        if (header) {
            if (schema[header]) {
                mapColToField[nameCol] = { colName: header, ...schema[header] }
            } else {
                mapColToField[nameCol] = { colName: header }
            }
        }
    }

    const cols = Object.keys(mapColToField)
    const totalCols = nameCols.length
    const objects = []

    for (let iRow = beginRow + 1; iRow <= endRow; iRow += 1) {
        const obj = {}
        let isEmpty = true
        for (let iCol = 0; iCol < totalCols; iCol += 1) {
            const colName = cols[iCol]
            const colConfig = mapColToField[colName]
            const fieldName = colConfig?.as || colConfig?.colName
            const fieldsString = ['question', 'hint', 'OPTION', 'explanation']
            const val =
                fieldsString.indexOf(fieldName) > -1
                    ? sheet[`${colName}${iRow}`]?.h
                    : sheet[`${colName}${iRow}`]?.v

            if (val !== undefined) {
                obj[fieldName] = colConfig?.format ? colConfig.format(val) : val
                isEmpty = false
            }
        }
        // var hasName = (name === 'true') ? 'Y' :'N'
        if (!isEmpty) {
            obj.__rowIndex = iRow
            objects.push(obj)
        }
    }

    return objects
}

function convertNumberToColumnName(no) {
    if (no <= 0) {
        return ''
    }

    const index = no % 26 || 26
    const c = ALPHABETS[index - 1]

    const next = (no - index) / 26

    return convertNumberToColumnName(next) + c
}

function convertColumnNameToNumber(col) {
    if (!/[A-Z]+/.test(col)) {
        throw new Error('Column name is invalid')
    }

    const chars = col.split('').reverse()

    return chars.reduce((prev, cur, i) => (ALPHABETS.indexOf(cur) + 1) * Math.pow(26, i) + prev, 0)
}

function validate(rows, schema) {
    const requiredFields = Object.keys(schema).filter(header => schema[header].required)
    const batchingFields = Object.keys(schema).filter(
        header => schema[header].validate?.type === 'batch',
    )
    let summaryErrorMessage = ''

    // check required fields
    for (let i = 0; i < requiredFields.length; i++) {
        const header = requiredFields[i]
        let errorMesssage = `${header} is required (not null).`
        const field = schema[header].as || header
        const errorRows = []

        rows.forEach(row => {
            if (!row[field]) {
                errorRows.push(row.__rowIndex)
            }
        })

        if (errorRows.length > 0) {
            errorMesssage += ` Error row${errorRows.length === 1 ? '' : 's'}: ${errorRows.join(
                '; ',
            )}`
            summaryErrorMessage += `${summaryErrorMessage ? '\n' : ''}${errorMesssage}`
        }
    }

    // validate by custom function
    for (let i = 0; i < batchingFields.length; i++) {
        const header = batchingFields[i]
        const validators = schema[header].validate.error
            ? [schema[header].validate.error]
            : schema[header].validate.errors || []
        const field = schema[header].as || header

        if (!validators.length) {
            continue
        }

        validators.forEach(validator => {
            let errorMesssage = validator.message || `${header} is invalid.`
            const fnValidate = validator.fn

            if (typeof fnValidate !== 'function') {
                throw new Error(
                    'Schema excel is invalid: ' + header + '.validate.fn must be a function',
                )
            }
            const errorRows = []

            rows.forEach(row => {
                if (!fnValidate(row[field])) {
                    errorRows.push(row.__rowIndex)
                }
            })

            if (errorRows.length > 0) {
                errorMesssage += ` Error row${errorRows.length === 1 ? '' : 's'}: ${errorRows.join(
                    '; ',
                )}`
                summaryErrorMessage += `${summaryErrorMessage ? '\n' : ''}${errorMesssage}`
            }
        })
    }

    return summaryErrorMessage
}

exports.read = (filePath, schema) => {
    const workbook = XLSX.readFileSync(filePath)
    const sheetName = workbook.SheetNames?.[0] // support only one sheet

    if (!sheetName) {
        throw new ValidationError('There is not any sheet')
    }

    const rows = transform(workbook.Sheets[sheetName], schema)
    const errorMesssage = validate(rows, schema)

    if (errorMesssage) {
        throw new ValidationError(errorMesssage)
    }

    return rows
}

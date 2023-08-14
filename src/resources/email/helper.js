exports.format = email => {
    if (!email || typeof email !== 'object') {
        return email
    }

    const obj = { ...email }
    obj.id = email._id
    delete obj._id
    delete obj.__v
    delete obj.isDeleted

    return obj
}

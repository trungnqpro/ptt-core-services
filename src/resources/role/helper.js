exports.format = role => {
    if (!role || typeof role !== 'object') {
        return role
    }

    const newRole = { ...role }
    newRole.id = role._id
    delete newRole._id
    delete newRole.__v

    return newRole
}

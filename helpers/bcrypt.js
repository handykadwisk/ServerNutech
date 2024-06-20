const bcrypt = require('bcryptjs');

const hashPassword = (plainPass) => {
    return bcrypt.hashSync(plainPass, bcrypt.genSaltSync(10))
}

const comparePassword = (plainPass, hashPassword) => {
    return bcrypt.compareSync(plainPass, hashPassword)
}

module.exports = { hashPassword, comparePassword}
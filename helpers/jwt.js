const jwt = require('jsonwebtoken')
const secret = process.env.JWT_SECRET || 'secret'

const signToken = (payload) => {
    return jwt.sign(payload, secret, {expiresIn:'12h'})
}

const verifyToken = (token) => {
    return jwt.verify(token, secret)
}

module.exports = { signToken, verifyToken }
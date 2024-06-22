const { verifyToken } = require('../helpers/jwt')
const { Model } = require('../models/model')

const authentication = async (req, res, next) => {
    try {
        const { authorization } = req.headers
        if (!authorization) throw { name: 'Invalid Token' }

        const [type, token] = authorization.split(" ");
        if (type !== "Bearer") throw { name: 'Invalid Token' }

        const { id } = verifyToken(token)

        const user = await Model.findUserbyId(id)
        if (!user) throw { name: "Invalid Token" }

        req.user = user

        next()

    } catch (error) {
        next(error)
    }
};

module.exports = { authentication }
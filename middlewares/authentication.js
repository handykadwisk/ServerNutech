const { verifyToken } = require('../helpers/jwt')
const { Model } = require('../models/model')

const authentication = async (req, res, next) => {
    try {
        //check user login ada tokenya atau engga
        const { authorization } = req.headers
        if (!authorization) throw { name: 'InvalidToken' }
        //cek token bearer atau tidak
        const [type, token] = authorization.split(" ");
        if (type !== "Bearer") throw { name: 'InvalidToken' }
        //cek lagi asli atau kagak
        const { id } = verifyToken(token)
        // checkdb nya
        const user = await Model.findUserbyId(id)
        if (!user) throw { name: "InvalidToken" }

        req.user = user

        next()

    } catch (error) {
        next(error)
    }
};

module.exports = { authentication }
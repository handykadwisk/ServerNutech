
const { comparePassword } = require('../helpers/bcrypt');
const { signToken } = require('../helpers/jwt');
const { Model } = require('../models/model')

module.exports = class Controller {

    static async registration(req, res, next) {

        try {
            //get values from req.body
            let { email, first_name, last_name, password, profile_image } = req.body;

            //insert data
            const data = await Model.register({
                email,
                first_name,
                last_name,
                password,
                profile_image
            });

            //response
            res.status(200).json({
                status: 0,
                message: "Registrasi berhasil silahkan login",
                data: null
            });

        } catch (error) {

            console.log(error);

            res.status(500).json({ message: error.message });
        }
    }

    static async login(req, res, next) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                throw { name: "email/password Required" };
            }

            const user = await Model.findUser(email);

            if (!user?.email) {
                throw { name: "Invalid Login" };
            }

            const passwordValid = await comparePassword(
                password,
                user.password
            );
            if (!passwordValid) {
                throw { name: "Invalid Login" };
            }

            const payload = {
                id: user.id,
                email: user.email,
            };
            const token = await signToken(payload);

            res.status(200).json({
                status: 0,
                message: "Login Sukses",
                data: {token}
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: error.message });
        }
    }


}
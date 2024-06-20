
const { comparePassword, hashPassword } = require('../helpers/bcrypt');
const { signToken } = require('../helpers/jwt');
const { Model } = require('../models/model')

module.exports = class Controller {

    static async registration(req, res, next) {

        try {
            //get values from req.body
            let { email, first_name, last_name, password, profile_image } = req.body;

            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

            if (!email) throw { name: 'Bad Request', field: "Email" }
            if (!first_name) throw { name: 'Bad Request', field: "first name" }
            if (!last_name) throw { name: 'Bad Request', field: "last name" }
            if (!password) throw { name: 'Bad Request', field: "Password" }

            if (!emailRegex.test(email)) throw { name: 'Email Invalid' };

            const user = await Model.findUser(email);

            if (user) throw { name: "Email Unique" }


            if (password.length < 8) throw { name: "Password Invalid" }

            password = await hashPassword(password)


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

            // console.log(error);
            // res.status(500).json({ message: error.message });
            next(error);

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
                data: { token }
            });
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ message: error.message });
        }
    }

    static async profile(req, res) {
        try {
            const id = req.user.id
            const data = await Model.findUserbyId(id)
            if (data) {
                delete data.password;
                delete data.id;
            }
            res.status(200).json({
                status: 0,
                message: "Sukses",
                data: { data }
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: error.message });
        }
    }


}
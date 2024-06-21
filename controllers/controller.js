const { hashPassword, comparePassword } = require('../helpers/bcrypt');
const { signToken } = require('../helpers/jwt');
const { Model } = require('../models/model')
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;


module.exports = class Controller {

    //registration
    static async registration(req, res, next) {
        try {
            //get values from req.body
            let { email, first_name, last_name, password, profile_image } = req.body;

            //validation 
            if (!email) throw { name: 'Bad Request', field: "Email" }
            if (!first_name) throw { name: 'Bad Request', field: "first name" }
            if (!last_name) throw { name: 'Bad Request', field: "last name" }
            if (!password) throw { name: 'Bad Request', field: "Password" }

            //validation email type
            if (!emailRegex.test(email)) throw { name: 'Email Invalid' };

            //validation email unique
            const user = await Model.findUser(email);
            if (user) throw { name: "Email Unique" }

            //validation length password
            if (password.length < 8) throw { name: "Password Invalid" }

            //hashing password
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
            console.log(error);
            next(error);
        }
    }

    //login
    static async login(req, res, next) {
        try {
            //get values from req.body
            const { email, password } = req.body;

            //validation email or password 
            if (!email) throw { name: 'Bad Request', field: "Email" }
            if (!password) throw { name: 'Bad Request', field: "Password" }

            //validation email type
            if (!emailRegex.test(email)) throw { name: "Email Invalid" }


            //validation finduser
            const user = await Model.findUser(email);
            if (!user?.email) throw { name: "Invalid Login" };

            //validation and compare password
            const passwordValid = await comparePassword(
                password,
                user.password
            );
            if (!passwordValid) throw { name: "Invalid Login" };

            //make payload from id and email
            const payload = {
                id: user.id,
                email: user.email,
            };

            //generate token from jwt
            const token = await signToken(payload);

            //response
            res.status(200).json({
                status: 0,
                message: "Login Sukses",
                data: { token }
            });
        } catch (error) {
            next(error)
        }
    }

    //get profile
    static async profile(req, res, next) {
        try {
            //get id user from authentication jwt
            const id = req.user.id

            //get data by id
            const data = await Model.findUserbyId(id)

            //exclude id and password
            if (data) {
                delete data.password;
                delete data.id;
            }

            //response
            res.status(200).json({
                status: 0,
                message: "Sukses",
                data: { data }
            });
        } catch (error) {
            next(error)
        }
    }

    //update data user
    static async updateData(req, res, next) {
        try {
            const id = req.user.id;
            const { email, first_name, last_name, password, profile_image } = req.body;

            const updatedUser = await Model.updateUserById(id, { email, first_name, last_name, password, profile_image });

            res.status(200).json({
                status: 0,
                message: "Update Pofile berhasil",
                data: updatedUser
            });
        } catch (error) {
            console.log(error.message);

        }
    }

    //update profile image
    static async updateProfileImage(req, res) {
        try {
          const id = req.user.id;
          const profileImage = req.file.path;
    
          const updatedUser = await Model.updateImgUserById(id, { profile_image: profileImage });
    
          if (updatedUser) {
            delete updatedUser.password;
          }
    
          res.status(200).json({
            status: 0,
            message: "Update Profile Image berhasil",
            data: updatedUser
          });
        } catch (error) {
          console.log(error.message,'errorr<<<<<<<<<');
        //   res.status(500).json({ message: error.message });
        }
      }


}
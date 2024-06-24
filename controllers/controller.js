const e = require('express');
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
            next(error)

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
            console.log(error.message);
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
    static async updateProfileImage(req, res,next) {
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
            next(error)
        }
    }

    //get banner
    static async getBanner(req, res, next) {
        try {
            const data = await Model.getBanner()
            res.status(200).json({
                status: 0,
                message: "Sukses",
                data: data
            });
        } catch (error) {
            next(error)
        }
    }
    //get services
    static async getService(req, res, next) {
        try {
            const data = await Model.getService()
            res.status(200).json({
                status: 0,
                message: "Sukses",
                data: data
            });
        } catch (error) {
            next(error)
        }
    }

    //get balance
    static async getBalance(req, res, next) {
        try {
            const id = req.user.id
            const data = await Model.getBalance(id)
            res.status(200).json({
                status: 0,
                message: "Get Balance Berhasil",
                data: data.balance
            })
        } catch (error) {
            console.log(error.message);
            next(error)
        }
    }

    //topup
    static async topup(req, res, next) {
        try {
            const user_id = req.user.id
            const amount = req.body.top_up_amount

            if (isNaN(amount) || amount <= 0 ) throw { name: "invalid amount" }

            const data = await Model.topup(user_id, amount)

            res.status(200).json({
                status: 0,
                message: "Top Up Balance berhasil",
                data: data.balance
            })
        } catch (error) {
            next(error)
            console.log(error.message);
        }
    }

    //trasaction
    static async transaction(req, res, next) {
        try {
            const user_id = req.user.id
            const service_code = req.body.service_code

            const service = await Model.getServicebyCode(service_code)
            if (!service) throw { name :"invalid service_code"}

            let data = await Model.transaction(user_id, service_code)

            res.status(200).json({
                status: 0,
                message: "Transaksi berhasil",
                data:{
                    invoice_number: data.invoice_number,
                    service_code: service.service_code ,
                    service_name: service.service_name,
                    transaction_type: data.transaction_type,
                    total_amount:data.total_amount,
                    created_on: data.created_on
                }
            })
        } catch (error) {
            next(error)
        }
    }

    //transactions history
    static async history(req, res,next) {
        try {
          const userId = req.user.id;
          const limit = req.query.limit ? parseInt(req.query.limit) : null;
    
          const data = await Model.getTransactionHistory(userId, limit);
    
          res.status(200).json({
            status: 0,
            message: 'Get History Berhasil',
            limit,
            records: { data }
          });
        } catch (error) {
          console.error(error);
          next(error)
        }
      }




}
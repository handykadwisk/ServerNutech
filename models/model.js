const Factory = require('./class')
const pool = require('../config/connection');
const { hashPassword } = require('../helpers/bcrypt');

class Model {

    static async register({ email, first_name, last_name, password, profile_image }) {
        try {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

            if (!emailRegex.test(email)) {
                throw ({message:'must be email format'});
            }
            if (!email || !first_name || !last_name || !password) {
                throw ({message:'cannot be null'})
            }

            if(password.length < 8){
                throw { message: "Password Invalid"}
              } 
            password = await hashPassword(password)

            let query = `INSERT INTO Users ("email", "first_name", "last_name", "password", "profile_image") 
            VALUES ($1, $2, $3, $4, $5) RETURNING *`;
            let result = await pool.query(query, [email, first_name, last_name, password, profile_image]);
            // return result.rows[0];
        } catch (error) {
            throw (error.message)
        }
    }

    static async findUser(email) {
        const query = {
          text: `SELECT * FROM users WHERE "email" = $1`,
          values: [email]
        };
      
        try {
          let result = await pool.query(query);
          return result.rows[0];
        } catch (error) {
          throw error;
        }
      }
}

module.exports = { Model }
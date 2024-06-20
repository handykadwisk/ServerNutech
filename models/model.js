const Factory = require('./class')
const pool = require('../config/connection')

class Model {

    static async register({ email, first_name, last_name, password, profile_image }) {
        try {
            let query = `INSERT INTO Users ("email", "first_name", "last_name", "password", "profile_image") 
            VALUES ('${email}','${first_name}', '${last_name}', '${password}', '${profile_image}');
            `
            let data = await pool.query(query);
            return true
        } catch (error) {
            throw(error.message)
        }
    }
}

module.exports = { Model }
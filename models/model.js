const Factory = require('./class')
const pool = require('../config/connection');

class Model {

    //add user
    static async register({ email, first_name, last_name, password, profile_image }) {
        try {
            const defaultProfileImg = `https://static-00.iconduck.com/assets.00/user-icon-1024x1024-dtzturco.png`

            if (!profile_image) { profile_image = defaultProfileImg }

            let query = `INSERT INTO Users ("email", "first_name", "last_name", "password", "profile_image") 
            VALUES ($1, $2, $3, $4, $5) RETURNING *`;

            let result = await pool.query(query, [email, first_name, last_name, password, profile_image]);
        } catch (error) {
            throw (error.message)
        }
    }

    //find user by email
    static async findUser(email) {
        try {
            const query = {
                text: `SELECT * FROM users WHERE "email" = $1`,
                values: [email]
            };

            let result = await pool.query(query);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    //find user by id
    static async findUserbyId(id) {
        try {
            const query = {
                text: `SELECT * FROM users WHERE "id" = $1`,
                values: [id]
            };
            let result = await pool.query(query);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    //update data
    static async updateUserById(id, { email, first_name, last_name, password, profile_image }) {
        const oldData = await this.findUserbyId(id)
        try {

            if (!email) { email = oldData.email }
            if (!first_name) { first_name = oldData.first_name }
            if (!last_name) { last_name = oldData.last_name }
            if (!password) { password = oldData.password }
            if (!profile_image) { profile_image = oldData.profile_image }

            const query = `
            UPDATE users 
            SET email = $1, first_name = $2, last_name = $3, password = $4, profile_image = $5 
            WHERE id = $6 
            RETURNING id, email, first_name, last_name, profile_image
          `;
            const values = [email, first_name, last_name, password, profile_image, id];
            const { rows } = await pool.query(query, values);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }
}

module.exports = { Model }
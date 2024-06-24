const pool = require('../config/connection');
const defaultProfileImg = `https://static-00.iconduck.com/assets.00/user-icon-1024x1024-dtzturco.png`

class Model {

    //add user
    static async register({ email, first_name, last_name, password, profile_image }) {
        try {
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

    //update image
    static async updateImgUserById(id, updateFields) {
        try {
            const setClause = [];
            const values = [];
            let index = 1;

            for (const key in updateFields) {
                if (key === 'profile_image' && !updateFields[key]) {
                    updateFields[key] = defaultProfileImg;
                }
                setClause.push(`${key} = $${index}`);
                values.push(updateFields[key]);
                index++;
            }

            values.push(id);

            const setClauseStr = setClause.join(', ');

            const query = `
            UPDATE Users 
            SET ${setClauseStr} 
            WHERE id = $${index} 
            RETURNING id, email, first_name, last_name, profile_image
          `;

            const { rows } = await pool.query(query, values);
            return rows[0];
        } catch (error) {
            throw new Error(error.message);
        }
    }

    //getbanner
    static async getBanner() {
        try {
            const query = { text: `SELECT * FROM banners` }
            let result = await pool.query(query);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    //getservice
    static async getService() {
        try {
            const query = { text: `SELECT * FROM services` }
            let result = await pool.query(query);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }
    //getservice
    static async getServicebyCode(service_code) {
        try {
            const query = {
                text: `SELECT * FROM services WHERE "service_code" = $1`,
                values: [service_code]
            };
            let result = await pool.query(query);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    //getBalance
    static async getBalance(id) {
        try {
            const query = {
                text: `SELECT * FROM balances WHERE "user_id" = $1`,
                values: [id]
            };
            let result = await pool.query(query);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    //topup
    static async update_topup(user_id, amount) {
        try {

            const updateBalanceQuery = `
            UPDATE balances
            SET balance = balance + $1
            WHERE user_id = $2
            RETURNING balance;
        `;
            const result = await pool.query(updateBalanceQuery, [amount, user_id]);

            // Generate invoice_number
            const date = new Date();
            const formattedDate = date.toISOString().slice(0, 10).replace(/-/g, '');
            const countTransactionsQuery = `
                SELECT COUNT(*) as count 
                FROM transactions 
                WHERE created_on::date = $1;
            `;
            const countResult = await pool.query(countTransactionsQuery, [formattedDate]);
            const count = parseInt(countResult.rows[0].count, 10) + 1;
            const invoiceNumber = `INV${formattedDate}-${count.toString().padStart(3, '0')}`;

            const insertTransactionQuery = `
            INSERT INTO transactions (user_id, invoice_number, transaction_type, description, total_amount)
            VALUES ($1, $2, 'TOPUP', 'Top Up balance', $3);
        `;
            await pool.query(insertTransactionQuery, [user_id, invoiceNumber, amount]);

            return result.rows[0];

        } catch (error) {
            console.log(error.message);
            throw error;

        }
    }

    static async insert_topup(user_id, amount) {
        try {

            const updateBalanceQuery = `
            INSERT INTO balances (user_id, balance)
            SELECT $2, $1
            RETURNING balance;
        `;
            const result = await pool.query(updateBalanceQuery, [amount, user_id]);

            // Generate invoice_number
            const date = new Date();
            const formattedDate = date.toISOString().slice(0, 10).replace(/-/g, '');
            const countTransactionsQuery = `
                SELECT COUNT(*) as count 
                FROM transactions 
                WHERE created_on::date = $1;
            `;
            const countResult = await pool.query(countTransactionsQuery, [formattedDate]);
            const count = parseInt(countResult.rows[0].count, 10) + 1;
            const invoiceNumber = `INV${formattedDate}-${count.toString().padStart(3, '0')}`;

            const insertTransactionQuery = `
            INSERT INTO transactions (user_id, invoice_number, transaction_type, description, total_amount)
            VALUES ($1, $2, 'TOPUP', 'Top Up balance', $3);
        `;
            await pool.query(insertTransactionQuery, [user_id, invoiceNumber, amount]);

            return result.rows[0];

        } catch (error) {
            console.log(error.message);
            throw error;

        }
    }

    //transaction
    static async transaction(user_id, service_code) {
        const service_data = await this.getServicebyCode(service_code)
        try {
            const amount = service_data.service_tariff

            const updateBalanceQuery = `
            UPDATE balances
            SET balance = balance - $1
            WHERE user_id = $2
            RETURNING balance;
        `;
            await pool.query(updateBalanceQuery, [amount, user_id]);

            //Generate invoice_number
            const date = new Date();
            const formattedDate = date.toISOString().slice(0, 10).replace(/-/g, '');
            const countTransactionsQuery = `
                SELECT COUNT(*) as count 
                FROM transactions 
                WHERE created_on::date = $1;
            `;
            const countResult = await pool.query(countTransactionsQuery, [formattedDate]);
            const count = parseInt(countResult.rows[0].count, 10) + 1;
            const invoiceNumber = `INV${formattedDate}-${count.toString().padStart(3, '0')}`;

            const insertTransactionQuery = `
            INSERT INTO transactions (user_id, invoice_number, transaction_type, description, total_amount)
            VALUES ($1, $2, 'PAYMENT', $3 , $4) 
            RETURNING invoice_number,transaction_type,description,total_amount,created_on;
        `;
            const result_transaction = await pool.query(insertTransactionQuery, [user_id, invoiceNumber, service_code, amount]);

            return result_transaction.rows[0]


        } catch (error) {
            console.log(error.message);
            throw error;

        }
    }

    //get transactions
    static async getTransactionHistory(userId, limit) {
        try {
            let query = `
        SELECT * FROM Transactions
        WHERE user_id = $1
        ORDER BY created_on DESC
      `;

            if (limit) {
                query += ` LIMIT $2`;
                const values = [userId, limit];
                const { rows } = await pool.query(query, values);
                return rows;
            } else {
                const values = [userId];
                const { rows } = await pool.query(query, values);
                return rows;
            }
        } catch (error) {
            throw error.message
        }
    }
}

module.exports = { Model }
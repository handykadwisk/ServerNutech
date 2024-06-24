const { Pool } = require('pg')

const pool = new Pool({
    user: 'postgres',
    host: 'monorail.proxy.rlwy.net',
    database: 'railway',
    password: 'NfRAkbVzkgeLgdbidqmnsygLlHxhIyXB',
    port: 53861,
    idleTimeoutMillis: 100
    // user: 'postgres',
    // host: 'localhost',
    // database: 'nutechtest',
    // password: 'postgres',
    // port: 5432,
    // idleTimeoutMillis: 100
})

const test = async () => {
    try {
        let test = await pool.query('SELECT NOW()')
        // console.log(test,'<<<<');
    } catch (error) {
        console.log(error.message);
    }
}
test()
module.exports = pool
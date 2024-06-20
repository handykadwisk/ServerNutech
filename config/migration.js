const pool = require('./connection.js')

const CreateTableUsers = `
    create table if not exists "Users"(
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(128) NOT NULL,
    last_name VARCHAR(128) NOT NULL,
    password VARCHAR(128) NOT NULL,
    profile_image VARCHAR(128)
    )
`;
const DropTable = `
    drop table if exists "Users"
`;

const migrate = async()=> {
    try {
        await pool.query(DropTable);
        await pool.query(CreateTableUsers)
        console.log(`migrate done`);
    } catch (error) {
        console.log(error.message,'eroooor');
    }
}
migrate()

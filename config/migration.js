const pool = require('./connection.js')

const CreateTableUsers = `
    create table if not exists "users"(
    id SERIAL PRIMARY KEY,
    email VARCHAR(128) NOT NULL,
    first_name VARCHAR(128) NOT NULL,
    last_name VARCHAR(128) NOT NULL,
    password VARCHAR(128) NOT NULL,
    profile_image VARCHAR(128)
    )
`;
const DropTable = `
    drop table if exists "users"
`;

const CreateTableBanners = `
    create table if not exists "banners"(
    id SERIAL PRIMARY KEY,
    banner_name VARCHAR(128) NOT NULL,
    banner_image VARCHAR(128) NOT NULL,
    description VARCHAR(128) NOT NULL
    )
`;
const DropTableBanners = `
    drop table if exists "banners"
`;

const CreateTableServices = `
    create table if not exists "services"(
    id SERIAL PRIMARY KEY,
    service_code VARCHAR(128) NOT NULL,
    service_name VARCHAR(128) NOT NULL,
    service_icon VARCHAR(128) NOT NULL,
    service_tariff INT NOT NULL
    )
`;
const DropTableServices = `
    drop table if exists "services"
`;

const CreateTableBalance = `
    create table if not exists "Balance"(
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    balance VARCHAR(128) NOT NULL
    )
`;
const DropTableBalance = `
    drop table if exists "Balance"
`;

const CreateTableTransaction = `
    create table if not exists "transactions"(
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    invoice_number VARCHAR(50) NOT NULL,
    transaction_type VARCHAR(50) NOT NULL,
    description VARCHAR(128) NOT NULL,
    total_amount INT NOT NULL,
    created_ON TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`;
const DropTableTransaction = `
    drop table if exists "transactions"
`;

const migrate = async () => {
    try {
        await pool.query(DropTable);
        await pool.query(CreateTableUsers)
        await pool.query(DropTableBanners);
        await pool.query(CreateTableBanners)
        await pool.query(DropTableServices);
        await pool.query(CreateTableServices);
        await pool.query(DropTableBalance);
        await pool.query(CreateTableBalance);
        await pool.query(DropTableTransaction);
        await pool.query(CreateTableTransaction);
        console.log(`migrate done`);
    } catch (error) {
        console.log(error.message, 'eroooor');
    }
}
migrate()

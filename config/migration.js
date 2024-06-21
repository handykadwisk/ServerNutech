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
    baner_image VARCHAR(128) NOT NULL,
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
    service_tariff INTEGER(128) NOT NULL
    )
`;
const DropTableServices = `
    drop table if exists "services"
`;

const migrate = async()=> {
    try {
        // await pool.query(DropTable);
        // await pool.query(CreateTableUsers)
        // await pool.query(DropTableBanners);
        // await pool.query(CreateTableBanners)
        // await pool.query(DropTableServices);
        await pool.query(CreateTableServices);
        console.log(`migrate done`);
    } catch (error) {
        console.log(error.message,'eroooor');
    }
}
migrate()

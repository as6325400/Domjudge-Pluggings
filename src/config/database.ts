import mariadb from 'mariadb';
import dotenv from 'dotenv';

dotenv.config()

const connection = mariadb.createConnection({
    host: process.env.DATABASE_HOST, 
    port: Number(process.env.DATABASE_PORT),
    user: process.env.DATABASE_USER, 
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
})

export default connection;
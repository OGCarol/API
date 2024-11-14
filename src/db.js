import { createPool } from "mysql2/promise";
import{ DB_DATABASE, DB_HOST, DB_PASSWORD, DB_PORT, DB_USE } from './config.js'
export const conmysql=createPool({
    host:DB_HOST,
    database:DB_DATABASE,
    user:DB_USE,
    password:DB_PASSWORD,
    port:DB_PORT
})
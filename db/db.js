import {Sequelize} from "sequelize";
import dotenv from "dotenv";
dotenv.config()

const db = new Sequelize({
    dialect: "mysql",
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    timezone: '+00:00',
    define: {
        timestamps: false
    }
})

export default db

export function openConnection() {
    return db.authenticate()
}

export function closeConnection() {
    return db.close
}
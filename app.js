import express from 'express';
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import notFoundMiddleware from "./middleware/not-found.middleware.js";
import authRouter from "./routes/auth.js"
import userRouter from "./routes/user.js"
import { runMigrations } from './migration.js';
import {errorHandlerMiddleware} from "./middleware/error-handle.middleware.js";
import {closeConnection, openConnection} from "./db/db.js";
import path from "path";
import fileDirName from "./utils/helpers/file-dirname.js";
const { __dirname } = fileDirName(import.meta);
dotenv.config()

const app = express()

app.get('/',function(req,res) {
    res.sendFile(path.join(__dirname+'/public/index.html'));
});

app.get('/registration',function(req,res) {
    res.sendFile(path.join(__dirname+'/public/views/registration.html'));
});

app.get('/login',function(req,res) {
    res.sendFile(path.join(__dirname+'/public/views/login.html'));
});

app.get('/profile',function(req,res) {
    res.sendFile(path.join(__dirname+'/public/views/profile.html'));
});

const corsOptions = {credentials:true, origin: process.env.URL}

app.use(express.static('./public'));
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/user', userRouter)

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const start = async () => {
    try {

        app.listen(process.env.APP_PORT, () => { console.log(`Server start on port ${process.env.APP_PORT}`) })
        await openConnection()
        await runMigrations();
        console.info('Connected')
        await closeConnection()

    } catch (error) {
        console.log(error)
    }
}

start()

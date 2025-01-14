import express from 'express'
import connectDB from './config/db.mjs'
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import router from './routes/userRoutes.mjs';   
import dotenv from 'dotenv';

dotenv.config();

const app = express()


app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:3000', // Allow only this origin
    methods: 'GET,POST,PUT,DELETE', // Allow only these methods
    allowedHeaders: 'Content-Type,Authorization', // Allow only these headers
}));
app.use(express.urlencoded({ extended: true }));

connectDB()

app.use('/api/users', router);


app.listen(5000, () => {
    console.log('server running at port 5000')
})










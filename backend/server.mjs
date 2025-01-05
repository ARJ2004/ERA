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
app.use(cors());


connectDB()

app.use('/api/users', router);


app.listen(5000, () => {
    console.log('server running at port 5000')
})










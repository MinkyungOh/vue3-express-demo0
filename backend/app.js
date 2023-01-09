import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//import {authenticateUser} from './utils/auth.js';
import auth from './api/auth.js';
app.use('/api/auth', auth);

app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message;
  res.status(status).json({
    message
  });
});


// CONNECT TO MONGODB SERVER
const {PORT, DB_USER, DB_PASSWORD} = process.env;
const MONGO_URI = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.x71bg.mongodb.net/testdb?retryWrites=true&w=majority`;

mongoose.set('strictQuery', false);
mongoose.connect(MONGO_URI, { useNewUrlParser: true });

// RUN SERVER
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

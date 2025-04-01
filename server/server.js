import express from 'express';
import dotenv from 'dotenv';
import authRouter from './routes/auth.js';
import bookRouter from './routes/book.js';
import { connectDB } from './lib/db.js';
import cors from 'cors';

const app = express();
dotenv.config();

const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/api/auth', authRouter);
app.use('/api/books', bookRouter);

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
  connectDB();
});

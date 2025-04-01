import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`DB connected ${conn.connection.host}`);
  } catch (error) {
    console.log('DB error');
    process.exit(1);
  }
};

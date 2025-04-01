import { v2 as cloudinary } from 'cloudinary';
import 'dotenv/config';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME || "dsxefv7ud",
  api_key: process.env.CLOUDINARY_API_KEY || "577858767169141",
  api_secret: process.env.CLOUDINARY_API_SECRET || "BXVBWsKZAIzsuDOiNu4gA7km-0s",
}); 

export default cloudinary;

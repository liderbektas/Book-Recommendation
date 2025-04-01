import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/user.js';

dotenv.config();

const protectRoute = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ message: 'Token not provided' });
  }

  const token = authorization.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Malformed token' });
  }

  try {
    const { userId } = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findOne({ _id: userId }).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('JWT Verify Error:', error);
    res.status(403).json({ message: 'Token is not valid' });
  }
};

export default protectRoute;

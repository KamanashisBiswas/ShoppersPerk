import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db';

import authRoutes from './routes/authRoutes';
import carouselRoutes from './routes/carouselRoutes';

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(helmet());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again after 15 minutes',
});

// Apply rate limiting to all requests
app.use(limiter);

app.use(cors());
app.use(express.json());



app.use('/api/auth', authRoutes);
app.use('/api/carousel', carouselRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

import multer from 'multer';

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      res.status(400).json({ message: 'File is too large. Maximum limit is 5MB.' });
      return;
    }
    res.status(400).json({ message: err.message });
    return;
  }
  
  // Custom errors might pass status code
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({ message: err.message || 'Server error', error: process.env.NODE_ENV === 'production' ? null : err.message });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

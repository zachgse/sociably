import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { connectDB } from './src/config/db.js';
import testRoutes from './src/routes/testRoute.js';
import authRoutes from './src/routes/authRoute.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials:true
}));
app.use(express.json());

// To get cookie via request
app.use(cookieParser());

// Connect to MongoDB
connectDB();

// Basic Route
app.get('/', (req, res) => {
  res.send('API Running');
});

// Routes
app.use('/api/test', testRoutes);
app.use('/api/auth', authRoutes);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

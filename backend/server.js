// Packages
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import http from "http";
import { Server } from 'socket.io';
// Config files
import { connectDB } from './src/config/db.js';
// Routes
import testRoutes from './src/routes/testRoute.js';
import authRoutes from './src/routes/authRoute.js';
import postRoutes from './src/routes/postRoute.js';
import commentRoutes from './src/routes/commentRoute.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials:true
}));
const server = http.createServer(app);
const io = new Server(server,{
  cors: {
    origin: 'http://localhost:3000',
    credentials:true,
    methods: ["GET","POST"]
  }
})

io.on('connection', (socket) => {
  socket.on('create_post', (data) => {
    io.emit('fetch_posts', data);
  });

  socket.on('like_post', (data) => {
    io.emit('fetch_single_post',data);
  })

  socket.on('create_comment', (data) => {
    io.emit('fetch_comments',data);
  });

  socket.on('like_comment', (data) => {
    io.emit('fetch_single_comment',data);
  });
});

app.use(express.json());

// To get cookie via request
app.use(cookieParser());

// Connect to MongoDB
connectDB();

// Basic Route
app.get('/', (req, res) => {
  res.send('API Running');
});

app.get('/api/emojis', async (req, res) => {
  const response = await fetch(process.env.EMOJI_API);
  const data = await response.json();
  res.status(200).json({msg:'List of feeling', data:data.slice(0,20)});
});

// Routes
app.use('/api/test', testRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);
app.use('/api/comment', commentRoutes);

app.use('/uploads', express.static('uploads'));

server.listen(PORT);

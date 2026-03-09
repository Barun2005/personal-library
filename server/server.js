const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables FIRST
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Serve uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --------------------
// MongoDB Connection
// --------------------
const mongoURI = process.env.MONGODB_URI?.trim();

if (!mongoURI) {
  console.warn('⚠️ MONGODB_URI not found. Falling back to local MongoDB');
}

const FINAL_MONGO_URI =
  mongoURI && mongoURI.startsWith('mongodb')
    ? mongoURI
    : 'mongodb://127.0.0.1:27017/library-tracker';

mongoose
  .connect(FINAL_MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    console.warn('⚠️ Running server without database connection');
  });

// --------------------
// Routes
// --------------------
app.use('/api/auth', require('./routes/auth'));
app.use('/api/books', require('./routes/books'));
app.use('/api/uploads', require('./routes/uploads'));

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

// --------------------
// Production build
// --------------------
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('*', (req, res) => {
    res.sendFile(
      path.resolve(__dirname, '../client/build', 'index.html')
    );
  });
}

// --------------------
// Server
// --------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  isbn: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['Want to Read', 'Currently Reading', 'Read'],
    default: 'Want to Read'
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  coverImage: {
    type: String,
    default: 'https://via.placeholder.com/150x200?text=No+Cover'
  },
  fileUrl: {
    type: String,
    default: ''
  },
  notes: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Book', BookSchema);

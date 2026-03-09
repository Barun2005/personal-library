const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const auth = require('../middleware/auth');

// @route   GET api/books
// @desc    Get all books for logged in user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const books = await Book.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    console.error('Get books error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET api/books/:id
// @desc    Get single book
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const book = await Book.findOne({ _id: req.params.id, user: req.user.id });
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    console.error('Get book error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST api/books
// @desc    Create a book
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { title, author, isbn, status, rating, notes, coverImage, fileUrl } = req.body;
    
    // Validation
    if (!title || !author) {
      return res.status(400).json({ message: 'Title and author are required' });
    }

    const book = new Book({
      user: req.user.id,
      title,
      author,
      isbn,
      status: status || 'Want to Read',
      rating: rating || 0,
      notes,
      coverImage: coverImage || 'https://via.placeholder.com/150x200?text=No+Cover',
      fileUrl
    });

    await book.save();
    res.status(201).json(book);
  } catch (error) {
    console.error('Create book error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT api/books/:id
// @desc    Update a book
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, author, isbn, status, rating, notes, coverImage, fileUrl } = req.body;
    
    // Validation
    if (!title || !author) {
      return res.status(400).json({ message: 'Title and author are required' });
    }

    const book = await Book.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { 
        title, 
        author, 
        isbn, 
        status, 
        rating, 
        notes, 
        coverImage, 
        fileUrl, 
        updatedAt: Date.now() 
      },
      { new: true, runValidators: true }
    );

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json(book);
  } catch (error) {
    console.error('Update book error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE api/books/:id
// @desc    Delete a book
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const book = await Book.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json({ message: 'Book removed successfully' });
  } catch (error) {
    console.error('Delete book error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
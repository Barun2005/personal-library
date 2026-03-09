import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  Typography,
  Rating,
  Stepper,
  Step,
  StepLabel,
  Alert,
} from '@mui/material';
import { CloudUpload, InsertPhoto } from '@mui/icons-material';
import { toast } from 'react-toastify';
import axios from 'axios';

const AddBookModal = ({ open, onClose, onBookAdded }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fileUrl, setFileUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    status: 'Want to Read',
    rating: 0,
    notes: '',
    coverImage: 'https://via.placeholder.com/150x200?text=No+Cover',
  });

  const steps = ['Book Details', 'Additional Info', 'Upload File'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRatingChange = (event, newValue) => {
    setFormData({ ...formData, rating: newValue });
  };

  const handleNext = () => {
    if (activeStep === 0 && (!formData.title || !formData.author)) {
      toast.error('Title and author are required');
      return;
    }
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      // Validate required fields
      if (!formData.title || !formData.author) {
        toast.error('Title and author are required');
        return;
      }

      const token = localStorage.getItem('token');
      const bookData = {
        ...formData,
        fileUrl: fileUrl || ''
      };

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };

      await axios.post('/api/books', bookData, config);
      
      toast.success('Book added successfully!');
      setFormData({
        title: '',
        author: '',
        isbn: '',
        status: 'Want to Read',
        rating: 0,
        notes: '',
        coverImage: 'https://via.placeholder.com/150x200?text=No+Cover',
      });
      setFileUrl('');
      setFileName('');
      setActiveStep(0);
      onBookAdded();
      onClose();
    } catch (err) {
      console.error('Add book error:', err);
      toast.error(err.response?.data?.message || 'Failed to add book');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <InsertPhoto sx={{ mr: 1 }} />
          Add New Book to Your Library
        </Box>
      </DialogTitle>
      
      <Stepper activeStep={activeStep} sx={{ px: 3, pt: 2 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <DialogContent>
        {activeStep === 0 && (
          <Box sx={{ mt: 2 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Book Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Author"
              name="author"
              value={formData.author}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              fullWidth
              label="ISBN"
              name="isbn"
              value={formData.isbn}
              onChange={handleChange}
              helperText="Optional"
            />
          </Box>
        )}

        {activeStep === 1 && (
          <Box sx={{ mt: 2 }}>
            <TextField
              margin="normal"
              fullWidth
              select
              label="Reading Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <MenuItem value="Want to Read">Want to Read</MenuItem>
              <MenuItem value="Currently Reading">Currently Reading</MenuItem>
              <MenuItem value="Read">Read</MenuItem>
            </TextField>
            
            <Box sx={{ mt: 3, mb: 2 }}>
              <Typography component="legend">Rating</Typography>
              <Rating
                name="rating"
                value={formData.rating}
                onChange={handleRatingChange}
                precision={0.5}
              />
              <Typography variant="body2" color="text.secondary">
                {formData.rating > 0 ? `${formData.rating} / 5` : 'Not rated'}
              </Typography>
            </Box>

            <TextField
              margin="normal"
              fullWidth
              multiline
              rows={3}
              label="Notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              helperText="Your thoughts about the book"
            />

            <TextField
              margin="normal"
              fullWidth
              label="Cover Image URL"
              name="coverImage"
              value={formData.coverImage}
              onChange={handleChange}
              helperText="Leave empty for default cover"
            />
          </Box>
        )}

        {activeStep === 2 && (
          <Box sx={{ mt: 2 }}>
            <Alert severity="info" sx={{ mb: 2 }}>
              Enter a direct URL to your book file (optional)
            </Alert>

            <TextField
              margin="normal"
              fullWidth
              label="File URL (PDF, EPUB, etc.)"
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              helperText="Example: https://example.com/book.pdf"
            />
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        
        <Box sx={{ flex: '1 1 auto' }} />
        
        {activeStep > 0 && (
          <Button onClick={handleBack} disabled={loading}>
            Back
          </Button>
        )}
        
        {activeStep < steps.length - 1 ? (
          <Button onClick={handleNext} variant="contained" disabled={loading}>
            Next
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading}
            startIcon={<CloudUpload />}
          >
            {loading ? 'Adding Book...' : 'Add to Library'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AddBookModal;
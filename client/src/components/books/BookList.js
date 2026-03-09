import React, { useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Rating,
} from '@mui/material';
import {
  Delete,
  Edit,
  Visibility,
  Download,
  Star,
  Book,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import axios from 'axios';

const BookCard = ({ book, onUpdate, onDelete }) => {
  const [openEdit, setOpenEdit] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [editData, setEditData] = useState(book);
  const [loading, setLoading] = useState(false);

  const statusColors = {
    'Want to Read': 'info',
    'Currently Reading': 'warning',
    'Read': 'success'
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.put(`/api/books/${book._id}`, editData, config);
      toast.success('Book updated successfully');
      setOpenEdit(false);
      onUpdate();
    } catch (err) {
      toast.error('Failed to update book');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        await axios.delete(`/api/books/${book._id}`, config);
        toast.success('Book deleted successfully');
        onDelete();
      } catch (err) {
        toast.error('Failed to delete book');
      }
    }
  };

  return (
    <>
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardMedia
          component="img"
          height="200"
          image={book.coverImage}
          alt={book.title}
          sx={{ objectFit: 'contain', bgcolor: '#f5f5f5', p: 2 }}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h6" component="div" noWrap>
            {book.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            by {book.author}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Rating
              value={book.rating}
              readOnly
              size="small"
              precision={0.5}
            />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              {book.rating.toFixed(1)}
            </Typography>
          </Box>
          
          <Chip
            label={book.status}
            size="small"
            color={statusColors[book.status] || 'default'}
            sx={{ mt: 1 }}
          />
          
          {book.isbn && (
            <Typography variant="caption" color="text.secondary" display="block">
              ISBN: {book.isbn}
            </Typography>
          )}
        </CardContent>
        
        <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
          <IconButton size="small" onClick={() => setOpenView(true)}>
            <Visibility />
          </IconButton>
          <IconButton size="small" onClick={() => setOpenEdit(true)}>
            <Edit />
          </IconButton>
          <IconButton size="small" onClick={handleDelete} color="error">
            <Delete />
          </IconButton>
          {book.fileUrl && (
            <IconButton
              size="small"
              href={book.fileUrl}
              target="_blank"
              download
            >
              <Download />
            </IconButton>
          )}
        </CardActions>
      </Card>

      {/* View Dialog */}
      <Dialog open={openView} onClose={() => setOpenView(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Book sx={{ mr: 1 }} />
            {book.title}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Box
                component="img"
                src={book.coverImage}
                alt={book.title}
                sx={{ width: '100%', borderRadius: 1 }}
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography variant="h6" gutterBottom>
                {book.title}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                by {book.author}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Rating value={book.rating} readOnly precision={0.5} />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  {book.rating} / 5
                </Typography>
              </Box>
              
              <Chip
                label={book.status}
                color={statusColors[book.status] || 'default'}
                sx={{ mb: 2 }}
              />
              
              {book.isbn && (
                <Typography variant="body2" paragraph>
                  <strong>ISBN:</strong> {book.isbn}
                </Typography>
              )}
              
              {book.notes && (
                <>
                  <Typography variant="subtitle2" gutterBottom>
                    Notes:
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {book.notes}
                  </Typography>
                </>
              )}
              
              {book.fileUrl && (
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  href={book.fileUrl}
                  target="_blank"
                  fullWidth
                >
                  Download File
                </Button>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenView(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Book</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Title"
              value={editData.title}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Author"
              value={editData.author}
              onChange={(e) => setEditData({ ...editData, author: e.target.value })}
            />
            <TextField
              margin="normal"
              fullWidth
              label="ISBN"
              value={editData.isbn}
              onChange={(e) => setEditData({ ...editData, isbn: e.target.value })}
            />
            <TextField
              margin="normal"
              fullWidth
              select
              label="Status"
              value={editData.status}
              onChange={(e) => setEditData({ ...editData, status: e.target.value })}
            >
              <MenuItem value="Want to Read">Want to Read</MenuItem>
              <MenuItem value="Currently Reading">Currently Reading</MenuItem>
              <MenuItem value="Read">Read</MenuItem>
            </TextField>
            <Box sx={{ mt: 2, mb: 1 }}>
              <Typography component="legend">Rating</Typography>
              <Rating
                value={editData.rating}
                onChange={(event, newValue) => {
                  setEditData({ ...editData, rating: newValue });
                }}
                precision={0.5}
              />
            </Box>
            <TextField
              margin="normal"
              fullWidth
              multiline
              rows={3}
              label="Notes"
              value={editData.notes}
              onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Cover Image URL"
              value={editData.coverImage}
              onChange={(e) => setEditData({ ...editData, coverImage: e.target.value })}
              helperText="Leave empty for default cover"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleUpdate} variant="contained" disabled={loading}>
            {loading ? 'Updating...' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const BookList = ({ books, onUpdate }) => {
  if (books.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Book sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No books in your library yet
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Add your first book to get started!
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {books.map((book) => (
        <Grid item key={book._id} xs={12} sm={6} md={4} lg={3}>
          <BookCard book={book} onUpdate={onUpdate} onDelete={onUpdate} />
        </Grid>
      ))}
    </Grid>
  );
};

export default BookList;
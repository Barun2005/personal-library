import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
  Alert,
} from '@mui/material';
import { 
  Logout, 
  Add, 
  Menu as MenuIcon,
  LibraryBooks,
  Person,
  Home
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import BookList from '../books/BookList';
import AddBookModal from '../books/AddBookModal';
import StatsCard from './StatsCard';
import ReadingChart from './ReadingChart';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [error, setError] = useState('');
  const { user, logout } = React.useContext(require('../../context/auth/AuthContext').default);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    if (!localStorage.getItem('token')) return;
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.get('/api/books', config);
      setBooks(res.data);
      setError('');
    } catch (err) {
      console.error('Fetch books error:', err);
      // Only show error if we're not loading (to prevent flicker on fresh login)
      if (books.length === 0) {
        setError('Failed to load books. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const stats = {
    total: books.length,
    read: books.filter(book => book.status === 'Read').length,
    reading: books.filter(book => book.status === 'Currently Reading').length,
    wantToRead: books.filter(book => book.status === 'Want to Read').length,
  };

  return (
    <>
      <AppBar position="static" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper', color: 'text.primary' }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={handleMenuOpen}
          >
            <MenuIcon />
          </IconButton>
          
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => { handleMenuClose(); setOpenAddModal(true); }}>
              <Add sx={{ mr: 1 }} /> Add Book
            </MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); navigate('/dashboard'); }}>
              <Home sx={{ mr: 1 }} /> Dashboard
            </MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); handleLogout(); }}>
              <Logout sx={{ mr: 1 }} /> Logout
            </MenuItem>
          </Menu>
          
          <LibraryBooks color="primary" sx={{ mr: 2 }} />
          
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Personal Library
          </Typography>
          
          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
              <Person sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {user.username}
              </Typography>
            </Box>
          )}
          
          <Button
            variant="contained"
            disableElevation
            startIcon={<Add />}
            onClick={() => setOpenAddModal(true)}
            size="small"
          >
            Add Book
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Welcome back, {user?.username || 'Reader'}! 👋
          </Typography>
          <Typography color="text.secondary">
            Here's what's happening with your library today.
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Total Books"
              value={stats.total}
              color="primary"
              icon={<LibraryBooks />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Read"
              value={stats.read}
              color="success"
              subtitle={`${stats.total > 0 ? Math.round((stats.read / stats.total) * 100) : 0}% of collection`}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Reading"
              value={stats.reading}
              color="warning"
              subtitle="Currently reading"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Want to Read"
              value={stats.wantToRead}
              color="info"
              subtitle="In your wishlist"
            />
          </Grid>
        </Grid>

        {/* Chart and Book List */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">
                  Your Books
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setOpenAddModal(true)}
                  size="small"
                >
                  Add New Book
                </Button>
              </Box>
              
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <BookList books={books} onUpdate={fetchBooks} />
              )}
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Reading Progress
              </Typography>
              <ReadingChart books={books} />
              
              <Box sx={{ mt: 4, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                <Typography variant="subtitle2" gutterBottom>
                  Quick Stats
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  • Average rating: {books.length > 0 
                    ? (books.reduce((sum, book) => sum + book.rating, 0) / books.length).toFixed(1) 
                    : '0.0'} ⭐
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Recently added: {books.length > 0 
                    ? new Date(books[0]?.createdAt).toLocaleDateString() 
                    : 'None'}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <AddBookModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onBookAdded={fetchBooks}
      />
    </>
  );
};

export default Dashboard;
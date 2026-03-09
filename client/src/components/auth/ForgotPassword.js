import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Avatar,
  CssBaseline,
  CircularProgress,
} from '@mui/material';
import { LockReset } from '@mui/icons-material';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      return setError('Please enter your email address.');
    }
    setLoading(true);
    setError('');

    // Simulate sending a reset email (backend endpoint can be wired up later)
    setTimeout(() => {
      setSent(true);
      setLoading(false);
    }, 1500);
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box sx={{ marginTop: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper elevation={4} sx={{ p: 4, width: '100%', borderRadius: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ m: 1, bgcolor: 'warning.main', width: 48, height: 48 }}>
              <LockReset />
            </Avatar>
            <Typography component="h1" variant="h5" fontWeight={600}>
              Forgot Password
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={0.5} textAlign="center">
              Enter your email address and we'll send you a link to reset your password.
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {sent ? (
            <Box>
              <Alert severity="success" sx={{ mb: 3 }}>
                ✅ If an account with <strong>{email}</strong> exists, a password reset link has been sent. Please check your inbox.
              </Alert>
              <Button
                component={Link}
                to="/login"
                fullWidth
                variant="contained"
                size="large"
                sx={{ borderRadius: 2, py: 1.2 }}
              >
                Back to Sign In
              </Button>
            </Box>
          ) : (
            <Box component="form" onSubmit={onSubmit}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                type="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{ mt: 2, mb: 2, py: 1.2, borderRadius: 2 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Send Reset Link'}
              </Button>

              <Button
                component={Link}
                to="/login"
                fullWidth
                variant="outlined"
                size="large"
                sx={{ borderRadius: 2, py: 1.2 }}
              >
                Back to Sign In
              </Button>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default ForgotPassword;

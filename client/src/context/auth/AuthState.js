import React, { useReducer } from 'react';
import axios from 'axios';
import AuthContext from './AuthContext';
import authReducer from './AuthReducer';
import { toast } from 'react-toastify';

const AuthState = ({ children }) => {
  const initialState = {
    token: localStorage.getItem('token'),
    user: JSON.parse(localStorage.getItem('user')) || null,
    isAuthenticated: localStorage.getItem('token') ? true : false,
    loading: true
  };

  const [state, dispatch] = useReducer(authReducer, initialState);

  // Set Auth Token
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  };

  // Load User
  const loadUser = async () => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }

    try {
      const res = await axios.get('/api/auth/me');
      dispatch({
        type: 'USER_LOADED',
        payload: res.data
      });
    } catch (err) {
      dispatch({ type: 'AUTH_ERROR' });
    }
  };

  // Register User
  const register = async (formData) => {
    try {
      const res = await axios.post('/api/auth/register', formData); // Assuming a /api/auth/register endpoint
      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: res.data
      });
      setAuthToken(res.data.token);
      loadUser(); // Call loadUser after successful registration
      toast.success('Registration successful!');
      return { success: true };
    } catch (err) {
      const error = err.response?.data?.message || 'Registration failed';
      toast.error(error);
      dispatch({ type: 'REGISTER_FAIL' });
      return { success: false, error };
    }
  };

  // Login User
  const login = async (formData) => {
    try {
      const res = await axios.post('/api/auth/login', formData);
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: res.data
      });
      setAuthToken(res.data.token);
      loadUser();
      toast.success('Login successful!');
      return { success: true };
    } catch (err) {
      const error = err.response?.data?.message || 'Login failed';
      toast.error(error);
      dispatch({ type: 'LOGIN_FAIL' });
      return { success: false, error };
    }
  };

  // Logout
  const logout = () => {
    setAuthToken(null);
    dispatch({ type: 'LOGOUT' });
    toast.info('Logged out successfully');
  };

  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        register,
        login,
        logout,
        loadUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthState;
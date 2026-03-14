import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import './index.css';
import App from './App';

import AuthState from './context/auth/AuthState';

// Set global base URL for all axios requests
axios.defaults.baseURL = 'https://personal-library-y4l4.onrender.com';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthState>
      <App />
    </AuthState>
  </React.StrictMode>
);
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

export default function ProtectedRoute({ children }) {
  const [auth, setAuth] = useState(null);
  useEffect(() => {
    axios.get('/api/auth/verify', { withCredentials: true })
      .then(() => setAuth(true))
      .catch(() => setAuth(false));
  }, []);
  if (auth === null) return <div>Loading...</div>;
  return auth ? children : <Navigate to="/login" />;
}


import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Signup from './Signup';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const api = import.meta.env.VITE_API_URL;


  const handleLogin = async () => {
    try {
      await axios.post(`${api}/api/auth/login`, {
        username,
        password,
      }, { withCredentials: true });
      navigate('/');
    } catch (err) {
      setMsg(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} /><br />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} /><br />
      <p>Create account,<Link to="/signup">if account does not exist?</Link></p>
      <button onClick={handleLogin}>Login</button>
      <p>{msg}</p>
    </div>
  );
};

export default Login;

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/signup', {
        username,
        password,
      });
      navigate('/login');
    } catch (err) {
      setMsg(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="container">
      <h2>Sign Up</h2>
      <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} /><br />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} /><br />
      <p>Use account,<Link to="/login">if account already exist?</Link></p>
      <button onClick={handleSignup}>Sign Up</button>
      <p>{msg}</p>
    </div>
  );
};

export default Signup;
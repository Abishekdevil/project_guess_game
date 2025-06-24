import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './style.css';

export default function History() {
  const [history, setHistory] = useState([]);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/auth/profile', { withCredentials: true })
      .then(res => setUsername(res.data.username))
      .catch(() => navigate('/login'));

    axios.get('http://localhost:5000/api/game/history', { withCredentials: true })
      .then(res => setHistory(res.data))
      .catch(() => navigate('/login'));
  }, []);

  return (
    <div className="container">
      <h2>Game History</h2>
      <h4>Welcome, {username}</h4>
      {history.length ? (
        <table>
          <thead>
            <tr>
              <th>Attempts</th>
              <th>Won</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {history.map((entry, i) => (
              <tr key={i}>
                <td>{entry.attempts}</td>
                <td>{entry.won ? '✅' : '❌'}</td>
                <td>{new Date(entry.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No games played yet.</p>
      )}
      <button onClick={() => navigate('/')}>Back to Game</button>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import confetti from 'canvas-confetti';
import './style.css';

const Game = () => {
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('');
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [randomNumber, setRandomNumber] = useState(null);
  const [theme, setTheme] = useState('light');
  const [shake, setShake] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const api = import.meta.env.VITE_API_URL;

  useEffect(() => {
    generateRandomNumber();
  }, [min, max]);

  
  
  const generateRandomNumber = () => {
    const rand = Math.floor(Math.random() * (max - min + 1)) + min;
    setRandomNumber(rand);
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const saveResult = async (won) => {
    try {
      await axios.post(`${api}/api/game/save-result`, {
        attempts,
        won
      }, { withCredentials: true });
    } catch (err) {
      console.error("Error saving game result", err);
    }
  };

  const checkGuess = () => {
    if (gameOver) return;

    const userGuess = parseInt(guess);
    if (isNaN(userGuess) || userGuess < min || userGuess > max) {
      setMessage(`⚠️ Enter a number between ${min} and ${max}`);
      triggerShake();
      return;
    }

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (userGuess === randomNumber) {
      setMessage("🎉 Congratulations! You guessed it!");
      confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } });
      saveResult(true);
      setGameOver(true);
      return;
    }

    if (newAttempts >= 10) {
      setGameOver(true);
      setMessage(`❌ Game Over! The number was ${randomNumber}`);
      saveResult(false);
      return;
    }

    triggerShake();

    if (Math.abs(userGuess - randomNumber) <= 5) {
      setMessage("🔥 Very close! Try again.");
    } else if (userGuess > randomNumber) {
      setMessage("📉 Too High! Try again.");
    } else {
      setMessage("📈 Too Low! Try again.");
    }
  };

  const resetGame = () => {
    generateRandomNumber();
    setGuess('');
    setMessage('');
    setAttempts(0);
    setGameOver(false);
  };

  const handleLogout = async () => {
    await axios.post(`${api}/api/auth/logout`, {}, { withCredentials: true });
    navigate('/login');
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className={`container ${theme}`}>
      <h2>Guess the Number</h2>
      <h3>Hello, {username}!</h3>

      <button onClick={toggleTheme}>
        Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
      </button>

      <div className="range-inputs">
        <label>
          Min: <input type="number" value={min} onChange={(e) => setMin(Number(e.target.value))} />
        </label>
        <label>
          Max: <input type="number" value={max} onChange={(e) => setMax(Number(e.target.value))} />
        </label>
      </div>

      <p>Guess a number between {min} and {max}</p>
      <input
        type="number"
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
        className={shake ? 'shake' : ''}
      />
      <button onClick={checkGuess} disabled={gameOver}>Submit Guess</button>
      <p id="message">{message}</p>
      <p>Attempts: {attempts} / 10</p>
      <button onClick={resetGame}>Restart</button>
      <button onClick={handleLogout}>Logout</button>
      <button onClick={() => navigate('/history')}>View History</button>
    </div>
  );
};

export default Game;

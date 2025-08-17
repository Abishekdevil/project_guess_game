const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// -------------------- Signup --------------------
router.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    await new User({ username, password: hashed }).save();
    res.status(201).json({ message: 'Signup successful' });
  } catch {
    res.status(400).json({ message: 'User already exists' });
  }
});

// -------------------- Login --------------------
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign(
    { userId: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '2h' }
  );

  // ✅ Important for cross-domain cookies
  res.cookie('token', token, {
    httpOnly: true,
    secure: false,        // must be true in production (HTTPS on Render/Netlify)
    sameSite: 'None',    // required when frontend + backend are on different domains
    maxAge: 2 * 60 * 60 * 1000 // 2h
  });

  res.json({ message: 'Login successful' });
});

// -------------------- Verify (for ProtectedRoute) --------------------
router.get('/verify', (req, res) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ message: 'Not authenticated' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    res.json({ user });
  });
});

// -------------------- Profile --------------------
router.get('/profile', (req, res) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ message: 'Not logged in' });
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ username: data.username });
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// -------------------- Logout --------------------
router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: true,
    sameSite: 'None'
  });
  res.json({ message: 'Logged out' });
});

module.exports = router;

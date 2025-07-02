const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const gameRoutes = require('./routes/game');

const app = express();
app.use(cors({ origin: 'https://guessgammee.netlify.app/', credentials: true }));
app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.uri)
  .then(() => console.log(' MongoDB connected'))
  .catch(err => console.error(' MongoDB error', err.message));

app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server at http://localhost:${PORT}`));

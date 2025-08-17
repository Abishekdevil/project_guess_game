const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();


const app = express();

const allowedOrigins = [
  "http://localhost:5173",             // dev (Vite)
  "http://guessgammeee.netlify.app"   // prod (Netlify)
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());


const authRoutes = require('./routes/auth');
const gameRoutes = require('./routes/game');

mongoose.connect(process.env.uri)
  .then(() => console.log(' MongoDB connected'))
  .catch(err => console.error(' MongoDB error', err.message));

app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server at http://localhost:${PORT}`));

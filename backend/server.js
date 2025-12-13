import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import productsRouter from './routes/products.js';
import fastfoodRouter from './routes/fastfood.js';
import configRouter from './routes/config.js'; // <--- IMPORT THIS

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

const MONGO_URI = process.env.MONGO_URI; 

mongoose.connect(MONGO_URI)
  .then(() => console.log('🍃 MongoDB Connected Successfully'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

// Routes
app.use('/api/products', productsRouter);
app.use('/api/fastfood', fastfoodRouter);
app.use('/api/config', configRouter); // <--- USE THIS

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  // Simple hardcoded admin check
  if (username === 'admin' && password === 'admin@123') {
    res.json({ success: true, token: 'admin-token-' + Date.now() });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.listen(PORT, () => {
  console.log(`🍰 Server running on port ${PORT}`);
});
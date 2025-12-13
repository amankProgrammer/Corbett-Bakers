import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose'; // Import mongoose
import dotenv from 'dotenv';
import productsRouter from './routes/products.js';
import fastfoodRouter from './routes/fastfood.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// --- DATABASE CONNECTION ---
// Paste your MongoDB string in a .env file, or hardcode here TEMPORARILY for testing
// ideally: process.env.MONGO_URI
const MONGO_URI = process.env.MONGO_URI; 

mongoose.connect(MONGO_URI)
  .then(() => console.log('🍃 MongoDB Connected Successfully'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

  
// Routes
app.use('/api/products', productsRouter);
app.use('/api/fastfood', fastfoodRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Admin authentication (simple check)
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin@123') {
    res.json({ success: true, token: 'admin-token-' + Date.now() });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🍰 Corbett Bakers API running at http://localhost:${PORT}`);
  console.log(`Admin panel: http://localhost:${PORT === 5000 ? 5173 : PORT}/#/admin`);
});

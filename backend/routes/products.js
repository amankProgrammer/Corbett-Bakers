import express from 'express';
import { db, runQuery, runUpdate } from '../db/init.js';

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    const rows = await runQuery('SELECT * FROM products ORDER BY created_at DESC');
    res.json(rows || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const rows = await runQuery('SELECT * FROM products WHERE id = ?', [req.params.id]);
    res.json(rows[0] || null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add product
router.post('/', async (req, res) => {
  try {
    const { id, name, description, price, category, image } = req.body;
    if (!id || !name || !price || !category) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    await runUpdate(
      'INSERT INTO products (id, name, description, price, category, image) VALUES (?, ?, ?, ?, ?, ?)',
      [id, name, description, price, category, image]
    );
    res.json({ success: true, id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update product
router.put('/:id', async (req, res) => {
  try {
    const { name, description, price, category, image } = req.body;
    await runUpdate(
      'UPDATE products SET name = ?, description = ?, price = ?, category = ?, image = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [name, description, price, category, image, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    await runUpdate('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

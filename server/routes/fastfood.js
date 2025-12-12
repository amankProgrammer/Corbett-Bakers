import express from 'express';
import { runQuery, runUpdate } from '../db/init.js';

const router = express.Router();

// Get all fast food items
router.get('/', async (req, res) => {
  try {
    const rows = await runQuery('SELECT * FROM fastfood ORDER BY created_at DESC');
    const formatted = rows.map(r => ({
      id: r.id,
      name: r.name,
      category: r.category,
      image: r.image,
      prices: {
        half: r.price_half,
        full: r.price_full
      }
    }));
    res.json(formatted || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single item
router.get('/:id', async (req, res) => {
  try {
    const rows = await runQuery('SELECT * FROM fastfood WHERE id = ?', [req.params.id]);
    const item = rows[0];
    if (item) {
      item.prices = { half: item.price_half, full: item.price_full };
      delete item.price_half;
      delete item.price_full;
    }
    res.json(item || null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add fast food item
router.post('/', async (req, res) => {
  try {
    const { id, name, category, image, prices } = req.body;
    if (!id || !name || !category) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    await runUpdate(
      'INSERT INTO fastfood (id, name, category, image, price_half, price_full) VALUES (?, ?, ?, ?, ?, ?)',
      [id, name, category, image, prices?.half || null, prices?.full || null]
    );
    res.json({ success: true, id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update fast food item
router.put('/:id', async (req, res) => {
  try {
    const { name, category, image, prices } = req.body;
    await runUpdate(
      'UPDATE fastfood SET name = ?, category = ?, image = ?, price_half = ?, price_full = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [name, category, image, prices?.half || null, prices?.full || null, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete fast food item
router.delete('/:id', async (req, res) => {
  try {
    await runUpdate('DELETE FROM fastfood WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

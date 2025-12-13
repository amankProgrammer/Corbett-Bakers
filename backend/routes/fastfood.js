import express from 'express';
import FastFood from '../models/FastFood.js'; // Import Mongoose Model

const router = express.Router();

// 1. Get all fast food items
router.get('/', async (req, res) => {
  try {
    // MongoDB stores the 'prices' object inside the document, 
    // so we don't need to manually map 'price_half'/'price_full' anymore!
    const items = await FastFood.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Get single item
router.get('/:id', async (req, res) => {
  try {
    const item = await FastFood.findOne({ id: req.params.id });
    res.json(item || null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Add fast food item
router.post('/', async (req, res) => {
  try {
    const { id, name, category, image, prices } = req.body;
    
    if (!id || !name || !category) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create new document
    const newItem = new FastFood({
      id,
      name,
      category,
      image,
      prices: {
        half: prices?.half || null,
        full: prices?.full || null
      }
    });

    await newItem.save();
    res.json({ success: true, id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Update fast food item
router.put('/:id', async (req, res) => {
  try {
    const { name, category, image, prices } = req.body;
    
    // Update the document matching the custom 'id'
    await FastFood.findOneAndUpdate(
      { id: req.params.id },
      { 
        name, 
        category, 
        image,
        prices: {
          half: prices?.half || null,
          full: prices?.full || null
        }
      }
    );
    
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Delete fast food item
router.delete('/:id', async (req, res) => {
  try {
    await FastFood.findOneAndDelete({ id: req.params.id });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
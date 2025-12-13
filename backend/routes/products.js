import express from 'express';
import Product from '../models/Product.js'; // Import the Mongoose Model

const router = express.Router();

// 1. Get all products
router.get('/', async (req, res) => {
  try {
    // .find() fetches everything
    // .sort({ createdAt: -1 }) sorts by newest first (like ORDER BY created_at DESC)
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Get single product
router.get('/:id', async (req, res) => {
  try {
    // We search using your custom 'id' field (not MongoDB's _id)
    const product = await Product.findOne({ id: req.params.id });
    res.json(product || null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Add product
router.post('/', async (req, res) => {
  try {
    const { id, name, description, price, category, image } = req.body;
    
    // validation
    if (!id || !name || !price || !category) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create a new instance of the model
    const newProduct = new Product({
      id,          // Custom ID from frontend
      name,
      description,
      price,
      category,
      image
    });

    // Save it to MongoDB Atlas
    await newProduct.save();
    
    res.json({ success: true, id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Update product
router.put('/:id', async (req, res) => {
  try {
    const { name, description, price, category, image } = req.body;
    
    // findOneAndUpdate( filter, update_data )
    await Product.findOneAndUpdate(
      { id: req.params.id }, 
      { name, description, price, category, image }
    );
    
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Delete product
router.delete('/:id', async (req, res) => {
  try {
    // findOneAndDelete matches your custom id and removes the document
    await Product.findOneAndDelete({ id: req.params.id });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
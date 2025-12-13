import express from 'express';
import SiteConfig from '../models/SiteConfig.js';

const router = express.Router();

// GET Settings
router.get('/', async (req, res) => {
  try {
    let config = await SiteConfig.findById('global_settings');
    if (!config) {
      config = await SiteConfig.create({ _id: 'global_settings' });
    }
    res.json(config);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE Settings
router.put('/', async (req, res) => {
  try {
    const config = await SiteConfig.findByIdAndUpdate(
      'global_settings',
      { $set: req.body },
      { new: true, upsert: true }
    );
    res.json(config);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
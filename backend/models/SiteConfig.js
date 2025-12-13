import mongoose from 'mongoose';

const siteConfigSchema = new mongoose.Schema({
  _id: { type: String, default: 'global_settings' }, // Fixed ID
  
  // General Info
  shopName: { type: String, default: 'Corbett Bakers' },
  tagline: { type: String, default: 'Homemade happiness' },
  whatsapp: { type: String, default: '919999999999' },
  address: { type: String, default: 'Bannakhera, Uttarakhand' },
  
  // Hero Section
  heroTitle: { type: String, default: 'Baked with Love, Served Fresh' },
  heroSubtitle: { type: String, default: 'Warm, cozy, and inviting bakes for every sweet moment.' },
  
  // Custom Banner
  bannerTitle: { type: String, default: 'Planning a Special Occasion?' },
  bannerText: { type: String, default: 'From weddings to birthdays, we create custom cakes.' },
}, { timestamps: true });

const SiteConfig = mongoose.model('SiteConfig', siteConfigSchema);
export default SiteConfig;
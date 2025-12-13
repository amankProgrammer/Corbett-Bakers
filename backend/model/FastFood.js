import mongoose from 'mongoose';

const fastFoodSchema = new mongoose.Schema({
  // Custom ID from frontend (e.g., 'ff123')
  id: { type: String, required: true, unique: true }, 
  name: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String },
  // MongoDB stores nested objects easily, so we match your frontend structure exactly
  prices: {
    half: { type: Number },
    full: { type: Number }
  }
}, { timestamps: true });

const FastFood = mongoose.model('FastFood', fastFoodSchema);
export default FastFood;
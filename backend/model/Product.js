import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  // Add this 'id' field so your frontend logic (p + Date.now) still works
  id: { type: String, required: true, unique: true }, 
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  image: { type: String },
  category: { type: String, required: true }
}, { timestamps: true }); // This adds createdAt and updatedAt automatically

const Product = mongoose.model('Product', productSchema);
export default Product;
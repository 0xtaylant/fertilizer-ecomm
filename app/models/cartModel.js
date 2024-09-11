import mongoose from 'mongoose';

const CartSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  stokIsmi: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
});

export default mongoose.models.Cart || mongoose.model('Cart', CartSchema);
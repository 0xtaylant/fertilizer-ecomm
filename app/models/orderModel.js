import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [{
    stokIsmi: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 }
  }],
  status: { 
    type: String, 
    required: true, 
    default: 'pending',
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
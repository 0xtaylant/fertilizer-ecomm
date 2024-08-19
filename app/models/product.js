import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
    productName: { type: String, required: true },
    productDescription: { type: String },
    productPrice: { type: Number, required: true },
    productImages: [{ type: String }],
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
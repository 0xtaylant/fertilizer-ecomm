'use client';
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProductsForm(
    {
        _id,
        productName: existingProductName,
        productDescription: existingProductDescription,
        productPrice: existingProductPrice,
        images,
    }) {
    const [productName, setProductName] = useState(existingProductName || '');
    const [productDescription, setProductDescription] = useState(existingProductDescription || '');
    const [productPrice, setProductPrice] = useState(existingProductPrice || '');
    const [goToProducts, setgoToProducts] = useState(false);
    const router = useRouter();
    async function createProduct(ev) {
        const data = {
            productName,
            productDescription,
            productPrice
        };
        ev.preventDefault();
        if (_id) {
            axios.put('/api/product', { ...data, _id });
        } else {

            axios.post('/api/product', data);
        }
        setgoToProducts(true);
    }
    if (goToProducts) {
        router.push('/products');
    }
    async function uploadImages(ev) {
        const files = ev.target.files;
        if (files?.length > 0) {
            const data = new FormData();
            files.forEach(file => data.append('file', file));
            //await axios.post('/api/product/upload', data);
        }
    }
    return (

        <form onSubmit={createProduct}>
            <label>Product Name</label>
            <input
                type="text"
                placeholder="product name"
                value={productName}
                onChange={ev => setProductName(ev.target.value)}
            />
            <label>Photos</label>
            <div className="mb-2">
                <label className="w-24 h-24 border border-green-950 cursor-pointer text-center flex items-center justify-center text-sm text-gray-500 rounded-lg bg-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15" />
                    </svg>
                    <div>
                        Upload
                    </div>
                <input type="file" onChange={uploadImages} className="hidden" />
                </label>
                {!images?.length && (
                    <div>No images on this product</div>
                )}
            </div>
            <label>Product Description</label>
            <textarea
                placeholder="product description"
                value={productDescription}
                onChange={ev => setProductDescription(ev.target.value)}
            />
            <label>Product Price</label>
            <input
                type="text" placeholder="price"
                value={productPrice}
                onChange={ev => setProductPrice(ev.target.value)}
            />
            <button
                type="submit"
                className="btn-primary">
                Save
            </button>

        </form>

    )
}
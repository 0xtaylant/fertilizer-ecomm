'use client';
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { set } from "mongoose";

export default function ProductsForm(
    {
        _id,
        productName: existingProductName,
        productDescription: existingProductDescription,
        productPrice: existingProductPrice,
        productImages: existingProductImages,
        category: existingCategory
    }) {
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState(existingCategory || '');
    const [productName, setProductName] = useState(existingProductName || '');
    const [productDescription, setProductDescription] = useState(existingProductDescription || '');
    const [productPrice, setProductPrice] = useState(existingProductPrice || '');
    const [productImages, setProductImages] = useState(existingProductImages || []);
    const [goToProducts, setgoToProducts] = useState(false);
    const router = useRouter();

    async function fetchCategories() {
        try {
            const response = await axios.get('/api/category');
            console.log("Categories response:", response);
            if (Array.isArray(response.data)) {
                setCategories(response.data);
                console.log("Categories set:", response.data);
            } else {
                console.error("Unexpected categories data:", response.data);
                setCategories([]);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
            setCategories([]);
        }
    }

    useEffect(() => {
        fetchCategories();
    }, []);


    async function saveProduct(ev) {
        ev.preventDefault();
        const data = {
            productName,
            productDescription,
            productPrice,
            productImages,
            category
        };
        console.log("Sending data to create/update product:", data);
        if (_id) {
            await axios.put('/api/product', { ...data, _id});
        } else {
            await axios.post('/api/product', data);
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
            for (const file of files) {
                data.append('file', file);
            }
            try {
                const res = await axios.post('/api/upload', data);
                console.log("res:", res.data);
                if (res.data.links) {
                    setProductImages(existingProductImages => [...existingProductImages, ...res.data.links]);
                }
            } catch (error) {
                console.error('Upload error:', error);
                // Handle error (e.g., show error message to user)
            }
        }
    }

    
    return (

        <form onSubmit={saveProduct}>
            <label>Product Name</label>
            <input
                type="text"
                placeholder="product name"
                value={productName}
                onChange={ev => setProductName(ev.target.value)}
            />
            <label>Category</label>
            <select value={category} onChange={ev => setCategory(ev.target.value)}>
                <option value="">uncategorized</option>
                {categories.length >0 && categories.map(c => (
                    <option value={c._id}>{c.name}</option> 
                ))}
            </select>
            <label>Photos</label>
            <div className="mb-2 flex flex-wrap gap-2">
                {productImages.length > 0 && productImages.map(link => (
                    <div key={link} className="h-24">
                        <img src={link} className="rounded-lg" />
                    </div>
                ))}
                <label className="w-24 h-24 border border-green-950 cursor-pointer text-center flex items-center justify-center text-sm text-gray-500 rounded-lg bg-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15" />
                    </svg>
                    <div>
                        Upload
                    </div>
                    <input type="file" onChange={uploadImages} className="hidden" />
                </label>
                {!productImages?.length && (
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
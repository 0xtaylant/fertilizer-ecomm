'use client';
import Layout from "@/app/components/Layout";
import axios from "axios";
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from "react";

export default function DeleteProductPage() {
    const router = useRouter();
    const [productInfo, setProductInfo] = useState();
    const params = useParams();
    const { id } = params;

    useEffect(() => {
        if (!id) {
            return;
        } else {
            axios.get('/api/product?id=' + id).then(response => {
                setProductInfo(response.data);
            });
        }
    }, [id]);

    function goBack() {
        router.push('/products');
    }

    async function deleteProduct() {
        axios.delete('/api/product?id=' + id).then(() => {
        goBack();
        });
    }

    return (
        <Layout>
            <div className="flex items-center justify-center h-screen">
                <div className="w-[40%] bg-yellow-300 p-6 rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold mb-4">Delete Product</h1>
                    <p className="mb-4">Are you sure you want to delete <b>"{productInfo?.productName}"</b>?</p>
                    <div className="flex justify-end">
                        <button className="btn-cancel mr-2" onClick={goBack}>Cancel</button>
                        <button className="btn-default" onClick={deleteProduct}>Delete</button>
                    </div>
                </div>
            </div>
        </Layout>
    )
}
'use client';
import Layout from "@/app/components/Layout";
import ProductsForm from "@/app/components/ProductsForm";

export default function Newproduct() {
    return (
        <Layout>
             <h1>New Product</h1>
            <ProductsForm />
        </Layout>
    )
}
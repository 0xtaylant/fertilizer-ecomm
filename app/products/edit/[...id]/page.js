"use client";
import Layout from '@/app/components/Layout';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import ProductsForm from '@/app/components/ProductsForm';
 
 export default function Edit() {
    const [productInfo, setProductInfo] = useState(null);
    const params = useParams();
    const { id } = params;
    const [product, setProduct] = useState(null);

    useEffect (()=>{   
        if(!id) return;
        console.log("consolelogid yeri",{id});
        axios.get('/api/product?id='+id).then(response => {
            console.log("console log data yeri",response.data);
            setProductInfo(response.data);
        })
     },[id]);
    return(
        <Layout>
             <h1>Edit Products</h1>
             {
                productInfo && (<ProductsForm {...productInfo} />
             )}
            
        </Layout>
    )
 }
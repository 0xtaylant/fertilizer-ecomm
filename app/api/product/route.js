import { NextResponse } from 'next/server';
import { mongooseConnect } from "@/lib/mongoose";
import Product from "@/app/models/product";

export async function GET(request) {
    await mongooseConnect();

    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    try {
        if (id) {
            const product = await Product.findById(id);
            if (!product) {
                return NextResponse.json({ error: 'Product not found' }, { status: 404 });
            }
            return NextResponse.json(product);
        } else {
            const products = await Product.find();
            return NextResponse.json(products);
        }
    } catch (error) {
        console.error('Error fetching product(s):', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request) {
    await mongooseConnect();
    try {
        const body = await request.json();
        const { productName, productDescription, productPrice, productImages } = body;
        const ProductDoc = await Product.create({
            productName,
            productDescription,
            productPrice,
            productImages
        });

        return NextResponse.json(ProductDoc, { status: 201 });
    } catch (error) {
        console.error("Error creating product:", error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}



export async function PUT(request) {
    await mongooseConnect();

    try {
        const body = await request.json();
        const {productName, productDescription, productPrice, productImages, _id} = body;
        
        const updatedProduct = await Product.findByIdAndUpdate(
            _id,
            { productName, productDescription, productPrice, productImages },
            { new: true }
        );
        return NextResponse.json(updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(request) {
    await mongooseConnect();
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    try {
        const deletedProduct = await Product.findByIdAndDelete(id);
        
        if (!deletedProduct) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Product deleted successfully', deletedProduct });

    } catch (error) {
        console.error('Error deleting product:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
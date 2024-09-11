import { NextResponse } from 'next/server';
import { mongooseConnect } from "@/lib/mongoose";
import SetoProduct from '@/app/models/setoProductModel';

export async function GET(request) {
    await mongooseConnect();

    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    try {
        if (id) {
            const product = await SetoProduct.findById(id);
            if (!product) {
                return NextResponse.json({ error: 'Product not found' }, { status: 404 });
            }
            return NextResponse.json(product);
        } else {
            const uniqueBrands = await SetoProduct.aggregate([
                { $group: { _id: "$markaIsmi" } },
                { $project: { _id: 0, markaIsmi: "$_id" } },
                { $sort: { markaIsmi: 1 } }  // Sort alphabetically
            ]);
            return NextResponse.json(uniqueBrands);
        }
    } catch (error) {
        console.error('Error fetching product(s):', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
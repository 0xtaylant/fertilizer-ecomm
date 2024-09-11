import { NextResponse } from 'next/server';
import { mongooseConnect } from "@/lib/mongoose";
import SetoProduct from '@/app/models/setoProductModel';

export async function GET(request) {
    await mongooseConnect();

    const { searchParams } = new URL(request.url);
    const markaIsmi = searchParams.get('markaIsmi');

    if (!markaIsmi) {
        return NextResponse.json({ error: 'MarkaIsmi parameter is required' }, { status: 400 });
    }

    try {
        const stoklar = await SetoProduct.find(
            { markaIsmi: markaIsmi },
            { stokIsmi: 1, _id: 0 }
        ).sort({ stokIsmi: 1 });
        return NextResponse.json(stoklar);
    } catch (error) {
        console.error('Error fetching Stok:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
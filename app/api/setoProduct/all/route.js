import { NextResponse } from 'next/server';
import { mongooseConnect } from "@/lib/mongoose";
import SetoProduct from '@/app/models/setoProductModel';

export async function GET() {
    await mongooseConnect();

    try {
        const products = await SetoProduct.find({}, {
            anaGrupIsmi: { $ifNull: ["$anaGrupIsmi", ""] },
            markaIsmi: { $ifNull: ["$markaIsmi", ""] },
            stokIsmi: { $ifNull: ["$stokIsmi", ""] },
            formulasyonIsmi: { $ifNull: ["$formulasyonIsmi", ""] },
            agirlikBirimIsmi: { $ifNull: ["$agirlikBirimIsmi", ""] },
            _id: 0
        }).sort({ anaGrupIsmi: 1, markaIsmi: 1, stokIsmi: 1 });
        return NextResponse.json(products);
    } catch (error) {
        console.error('Error fetching all products:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

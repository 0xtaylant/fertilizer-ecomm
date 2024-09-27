import { NextResponse } from 'next/server';
import { mongooseConnect } from "@/lib/mongoose";
import SetoProduct from '@/app/models/setoProductModel';

export async function GET() {
    await mongooseConnect();

    try {
        const agirlikBirimleri = await SetoProduct.distinct('agirlikBirimIsmi');
        return NextResponse.json(agirlikBirimleri);
    } catch (error) {
        console.error('Error fetching agirlikBirimleri:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

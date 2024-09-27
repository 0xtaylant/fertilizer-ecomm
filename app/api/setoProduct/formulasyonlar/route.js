import { NextResponse } from 'next/server';
import { mongooseConnect } from "@/lib/mongoose";
import SetoProduct from '@/app/models/setoProductModel';

export async function GET() {
    await mongooseConnect();

    try {
        const formulasyonlar = await SetoProduct.distinct('formulasyonIsmi');
        return NextResponse.json(formulasyonlar);
    } catch (error) {
        console.error('Error fetching formulasyonlar:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

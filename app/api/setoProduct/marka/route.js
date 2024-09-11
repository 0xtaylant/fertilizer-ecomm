import { NextResponse } from 'next/server';
import { mongooseConnect } from "@/lib/mongoose";
import SetoProduct from '@/app/models/setoProductModel';

export async function GET(request) {
    await mongooseConnect();

    const { searchParams } = new URL(request.url);
    const anaGrup = searchParams.get('anaGrup');

    if (!anaGrup) {
        return NextResponse.json({ error: 'AnaGrup parameter is required' }, { status: 400 });
    }

    try {
        const markalar = await SetoProduct.aggregate([
            { $match: { anaGrupIsmi: anaGrup } },
            { $group: { _id: "$markaIsmi" } },
            { $project: { _id: 0, markaIsmi: "$_id" } },
            { $sort: { markaIsmi: 1 } }
        ]);
        return NextResponse.json(markalar);
    } catch (error) {
        console.error('Error fetching Marka:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
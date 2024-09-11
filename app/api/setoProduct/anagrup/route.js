import { NextResponse } from 'next/server';
import { mongooseConnect } from "@/lib/mongoose";
import SetoProduct from '@/app/models/setoProductModel';

export async function GET() {
    await mongooseConnect();

    try {
        const anaGruplar = await SetoProduct.aggregate([
            { $group: { _id: "$anaGrupIsmi" } },
            { $project: { _id: 0, anaGrupIsmi: "$_id" } },
            { $sort: { anaGrupIsmi: 1 } }
        ]);
        return NextResponse.json(anaGruplar);
    } catch (error) {
        console.error('Error fetching AnaGrup:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
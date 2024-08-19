import { NextResponse } from 'next/server';
import { mongooseConnect } from "@/lib/mongoose";
import Category from "@/app/models/category"; // Make sure this path is correct

export async function POST(request) {
    await mongooseConnect();
    try {
        const body = await request.json();
        console.log("Received category data:", body);
        const { name } = body;
        
        if (!name) {
            return NextResponse.json({ error: "Category name is required" }, { status: 400 });
        }

        const categoryDoc = await Category.create({ name });
        console.log("Created category:", categoryDoc);
        
        return NextResponse.json(categoryDoc, { status: 201 });
    } catch (error) {
        console.error("Error creating category:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(request) {
    await mongooseConnect();
    try {
        const categories = await Category.find();
        return NextResponse.json(categories);
    } catch (error) {
        console.error("Error fetching categories:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
import { NextResponse } from 'next/server';
import { mongooseConnect } from "@/lib/mongoose";
import Order from '@/app/models/orderModel';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(request, { params }) {
  await mongooseConnect();
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;

  try {
    const order = await Order.findOne({ _id: id, userId: session.user.id });
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  await mongooseConnect();
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;
  const updateData = await request.json();

  try {
    const order = await Order.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      { items: updateData.items },
      { new: true }
    );

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
    await mongooseConnect();
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  
    const { id } = params;
  
    try {
      const deletedOrder = await Order.findOneAndDelete({ _id: id, userId: session.user.id });
  
      if (!deletedOrder) {
        return NextResponse.json({ error: 'Order not found or unauthorized' }, { status: 404 });
      }
  
      return NextResponse.json({ message: 'Order deleted successfully' });
    } catch (error) {
      return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
    }
  }
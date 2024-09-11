import { NextResponse } from 'next/server';
import { mongooseConnect } from "@/lib/mongoose";
import Order from '@/app/models/orderModel';
import Cart from '@/app/models/cartModel';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";


export async function GET(request) {
    await mongooseConnect();
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  
    try {
      const orders = await Order.find({ userId: session.user.id }).sort({ createdAt: -1 });
      return NextResponse.json(orders);
    } catch (error) {
      return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
  }

export async function POST(request) {
  await mongooseConnect();
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { items } = await request.json();

  try {
    // Create a new order
    const order = new Order({
      userId: session.user.id, // Use the user ID from the session
      items: items.map(item => ({
        stokIsmi: item.stokIsmi,
        quantity: item.quantity
      })),
      status: 'pending',
      createdAt: new Date()
    });
    await order.save();

    // Clear the cart
    await Cart.deleteMany({ userId: session.user.id });

    return NextResponse.json({ message: 'Order created successfully', orderId: order._id });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
    await mongooseConnect();
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  
    const { orderId } = params;
    const { status } = await request.json();
  
    try {
      const order = await Order.findOneAndUpdate(
        { _id: orderId, userId: session.user.id },
        { status },
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
  
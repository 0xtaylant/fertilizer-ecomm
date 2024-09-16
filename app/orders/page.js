"use client";
import { useState, useEffect } from 'react';
import Layout from "../components/Layout";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (sessionStatus === "authenticated" && session?.user?.id) {
      fetchOrders();
    } else if (sessionStatus === "unauthenticated") {
      router.push('/login');
    }
  }, [sessionStatus, session, router]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/orders');
      setOrders(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch orders');
      setLoading(false);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm('Bu siparişi silmek istediğinizden emin misiniz?')) {
      try {
        await axios.delete(`/api/orders/${orderId}`);
        fetchOrders(); // Refresh the orders list after deletion
      } catch (err) {
        setError('Failed to delete order');
      }
    }
  };

  if (sessionStatus === "loading" || loading) {
    return <Layout><div>Loading...</div></Layout>;
  }

  if (error) {
    return <Layout><div>Error: {error}</div></Layout>;
  }

  return (
    <Layout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-6">Siparişler</h1>
        {orders.length === 0 ? (
          <p>Henüz sipariş bulunmamaktadır.</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">Sipariş ID</th>
                <th className="border border-gray-300 px-4 py-2">Tarih</th>
                <th className="border border-gray-300 px-4 py-2">Ürünler</th>
                <th className="border border-gray-300 px-4 py-2">İşlemler</th>
                <th className="border border-gray-300 px-4 py-2">Sipariş Durumu</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="border border-gray-300 px-4 py-2">{order._id}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <ul>
                      {order.items.map((item, index) => (
                        <li key={index}>{item.stokIsmi} - Adet: {item.quantity}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <Link href={`/orders/edit/${order._id}`} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded mr-2">
                      Düzenle
                    </Link>
                    <button
                      onClick={() => handleDeleteOrder(order._id)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                    >
                      Sil
                    </button>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
}
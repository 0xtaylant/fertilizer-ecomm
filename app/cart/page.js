"use client";
import Layout from "../components/Layout";
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCart, updateCartItem, removeFromCart, finalizeOrder } from '../../store/cartSlice';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { items, status, error } = useSelector((state) => state.cart);
  const { data: session, status: sessionStatus } = useSession();

  useEffect(() => {
    if (sessionStatus === "authenticated" && session?.user?.id) {
      dispatch(fetchCart(session.user.id));
    } else if (sessionStatus === "unauthenticated") {
      router.push('/login');
    }
  }, [dispatch, session, sessionStatus, router]);

  const handleUpdateQuantity = (stokIsmi, quantity) => {
    if (session?.user?.id) {
      dispatch(updateCartItem({ userId: session.user.id, stokIsmi, quantity }));
    }
  };

  const handleRemoveItem = (stokIsmi) => {
    if (session?.user?.id) {
      dispatch(removeFromCart({ userId: session.user.id, stokIsmi }));
    }
  };

  const handleFinalizeOrder = () => {
    if (items.length > 0 && session?.user?.id) {
      dispatch(finalizeOrder(session.user.id));
    } else if (!session?.user?.id) {
      alert("Please log in to finalize your order.");
      router.push('/login');
    } else {
      alert("Your cart is empty. Add items before finalizing the order.");
    }
  };

  if (sessionStatus === "loading" || status === 'loading') {
    return <Layout><div>Loading...</div></Layout>;
  }

  if (status === 'failed') {
    return <Layout><div>Error: {error}</div></Layout>;
  }

  return (
    <Layout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-6">Sepetim</h1>
        {items.length === 0 ? (
          <p>Sepetiniz boş.</p>
        ) : (
          <>
            <table className="w-full border-collapse border border-gray-300 mb-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2">Ürün</th>
                  <th className="border border-gray-300 px-4 py-2">Adet</th>
                  <th className="border border-gray-300 px-4 py-2">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.stokIsmi}>
                    <td className="border border-gray-300 px-4 py-2">{item.stokIsmi}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleUpdateQuantity(item.stokIsmi, parseInt(e.target.value))}
                        className="w-20 px-2 py-1 border rounded"
                      />
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <button
                        onClick={() => handleRemoveItem(item.stokIsmi)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                      >
                        Kaldır
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              onClick={handleFinalizeOrder}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Siparişi Tamamla
            </button>
          </>
        )}
      </div>
    </Layout>
  );
}
"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/store/cartSlice';
import { useSession } from 'next-auth/react';

export default function ProductHierarchy() {
  const [anaGruplar, setAnaGruplar] = useState([]);
  const [selectedAnaGrup, setSelectedAnaGrup] = useState(null);
  const [markalar, setMarkalar] = useState([]);
  const [selectedMarka, setSelectedMarka] = useState(null);
  const [stoklar, setStoklar] = useState([]);
  const [quantities, setQuantities] = useState({});
  const dispatch = useDispatch();
  const { data: session } = useSession();

  useEffect(() => {
    fetchAnaGruplar();
  }, []);

  useEffect(() => {
    if (selectedAnaGrup) {
      fetchMarkalar(selectedAnaGrup);
    }
  }, [selectedAnaGrup]);

  useEffect(() => {
    if (selectedMarka) {
      fetchStoklar(selectedMarka);
    }
  }, [selectedMarka]);

  const fetchAnaGruplar = async () => {
    try {
      const response = await axios.get('/api/setoProduct/anagrup');
      setAnaGruplar(response.data);
    } catch (error) {
      console.error('Error fetching AnaGruplar:', error);
    }
  };

  const fetchMarkalar = async (anaGrup) => {
    try {
      const response = await axios.get(`/api/setoProduct/marka?anaGrup=${encodeURIComponent(anaGrup)}`);
      setMarkalar(response.data);
      setSelectedMarka(null);
      setStoklar([]);
    } catch (error) {
      console.error('Error fetching Markalar:', error);
    }
  };

  const fetchStoklar = async (marka) => {
    try {
      const response = await axios.get(`/api/setoProduct/stok?markaIsmi=${encodeURIComponent(marka)}`);
      setStoklar(response.data);
    } catch (error) {
      console.error('Error fetching Stoklar:', error);
    }
  };


  const handleQuantityChange = (stokIsmi, value) => {
    setQuantities(prev => ({
      ...prev,
      [stokIsmi]: Math.max(0, parseInt(value) || 0)
    }));
  };

  const handleAddToCart = (stokIsmi) => {
    const quantity = quantities[stokIsmi] || 0;
    if (quantity > 0 && session?.user?.id) {
      dispatch(addToCart({ userId: session.user.id, stokIsmi, quantity }));
      setQuantities(prev => ({ ...prev, [stokIsmi]: 0 }));
    } else if (!session?.user?.id) {
      alert("Please log in to add items to your cart.");
    } else {
      alert("Please enter a valid quantity");
    }
  };

  return (
    <Layout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-6">Ürün Hiyerarşisi</h1>
        <div className="mb-4">
          <h2 className="text-lg font-bold mb-2">Ana Gruplar</h2>
          <div className="flex flex-wrap gap-2">
            {anaGruplar.map((anaGrup) => (
              <button
                key={anaGrup.anaGrupIsmi}
                onClick={() => setSelectedAnaGrup(anaGrup.anaGrupIsmi)}
                className={`px-4 py-2 rounded ${selectedAnaGrup === anaGrup.anaGrupIsmi ? 'bg-blue-500 text-white' : 'bg-gray-200'
                  }`}
              >
                {anaGrup.anaGrupIsmi}
              </button>
            ))}
          </div>
        </div>

        {selectedAnaGrup && (
          <div className="mb-4">
            <h2 className="text-lg font-bold mb-2">Markalar</h2>
            <div className="flex flex-wrap gap-2">
              {markalar.map((marka) => (
                <button
                  key={marka.markaIsmi}
                  onClick={() => setSelectedMarka(marka.markaIsmi)}
                  className={`px-4 py-2 rounded ${selectedMarka === marka.markaIsmi ? 'bg-green-500 text-white' : 'bg-gray-200'
                    }`}
                >
                  {marka.markaIsmi}
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedMarka && (
          <div>
            <h2 className="text-lg font-bold mb-2">Stoklar</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2">Stok İsmi</th>
                    <th className="border border-gray-300 px-4 py-2">Adet</th>
                    <th className="border border-gray-300 px-4 py-2">İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {stoklar.map((stok, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="border border-gray-300 px-4 py-2">{stok.stokIsmi}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        <input
                          type="number"
                          min="0"
                          value={quantities[stok.stokIsmi] || ''}
                          onChange={(e) => handleQuantityChange(stok.stokIsmi, e.target.value)}
                          className="w-20 px-2 py-1 border rounded"
                        />
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <button
                          onClick={() => handleAddToCart(stok.stokIsmi)}
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded"
                        >
                          Sepete Ekle
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

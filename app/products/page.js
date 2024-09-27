"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/store/cartSlice';
import { useSession } from 'next-auth/react';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Plus, Minus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/select";

export default function ProductCatalog() {
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

  const handleQuantityChange = (stokIsmi, delta) => {
    setQuantities(prev => ({
      ...prev,
      [stokIsmi]: Math.max(0, (prev[stokIsmi] || 0) + delta)
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
        <h1 className="text-3xl font-bold mb-8">Fertilizer Product Catalog</h1>
        
        <div className="flex space-x-4 mb-4">
          <div className="w-1/2">
            <h2 className="text-lg font-bold mb-2">Ana Gruplar</h2>
            <Select onValueChange={(value) => setSelectedAnaGrup(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Ana Grup" />
              </SelectTrigger>
              <SelectContent>
                {anaGruplar.map((anaGrup) => (
                  <SelectItem key={anaGrup.anaGrupIsmi} value={anaGrup.anaGrupIsmi}>
                    {anaGrup.anaGrupIsmi}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-1/2">
            <h2 className="text-lg font-bold mb-2">Markalar</h2>
            <Select 
              onValueChange={(value) => setSelectedMarka(value)} 
              disabled={!selectedAnaGrup}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={selectedAnaGrup ? "Select Marka" : "Select Ana Grup first"} />
              </SelectTrigger>
              <SelectContent>
                {markalar.map((marka) => (
                  <SelectItem key={marka.markaIsmi} value={marka.markaIsmi}>
                    {marka.markaIsmi}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {selectedMarka && (
          <div>
            <h2 className="text-lg font-bold mb-2">Stoklar</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {stoklar.map((stok) => (
                <div 
                  key={stok.stokIsmi} 
                  className={`border rounded-lg p-4 flex flex-col ${
                    quantities[stok.stokIsmi] > 0 ? 'bg-gray-200' : ''
                  }`}
                >
                  <img 
                    src="https://img.freepik.com/premium-photo/pouring-granulated-fertilizer-bushes-garden_960396-576091.jpg" 
                    alt={stok.stokIsmi} 
                    className="w-full h-48 object-cover mb-4 rounded"
                  />
                  <h3 className="text-lg font-semibold">{stok.stokIsmi}</h3>
                  <div className="flex items-center mb-2 mt-2">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => handleQuantityChange(stok.stokIsmi, -1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input 
                      type="number" 
                      min="0" 
                      value={quantities[stok.stokIsmi] || 0} 
                      onChange={(e) => handleQuantityChange(stok.stokIsmi, parseInt(e.target.value) - (quantities[stok.stokIsmi] || 0))}
                      className="w-16 mx-2 text-center"
                    />
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => handleQuantityChange(stok.stokIsmi, 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button onClick={() => handleAddToCart(stok.stokIsmi)} className="mt-2">Add to Cart</Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
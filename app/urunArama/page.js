"use client";
import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/store/cartSlice';
import { useSession } from 'next-auth/react';
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/select";

export default function ProductSearch() {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    anaGrupIsmi: '',
    markaIsmi: '',
    stokIsmi: '',
    formulasyonIsmi: '',
    agirlikBirimIsmi: ''
  });
  const [quantities, setQuantities] = useState({});
  const dispatch = useDispatch();
  const { data: session } = useSession();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/setoProduct/all');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const filteredItems = useMemo(() => {
    return products.filter((product) => {
      return (
        (filters.anaGrupIsmi === "" || product.anaGrupIsmi === filters.anaGrupIsmi) &&
        (filters.markaIsmi === "" || product.markaIsmi === filters.markaIsmi) &&
        (filters.stokIsmi === "" || product.stokIsmi === filters.stokIsmi) &&
        (filters.formulasyonIsmi === "" || product.formulasyonIsmi === filters.formulasyonIsmi) &&
        (filters.agirlikBirimIsmi === "" || product.agirlikBirimIsmi === filters.agirlikBirimIsmi)
      );
    });
  }, [filters, products]);

  const uniqueValues = useMemo(() => {
    return {
      anaGrupIsmi: Array.from(new Set(filteredItems.map(product => product.anaGrupIsmi))),
      markaIsmi: Array.from(new Set(filteredItems.map(product => product.markaIsmi))),
      stokIsmi: Array.from(new Set(filteredItems.map(product => product.stokIsmi))),
      formulasyonIsmi: Array.from(new Set(filteredItems.map(product => product.formulasyonIsmi))),
      agirlikBirimIsmi: Array.from(new Set(filteredItems.map(product => product.agirlikBirimIsmi))),
    };
  }, [filteredItems]);

  const handleFilterChange = (name, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value === "all" ? "" : value === "__EMPTY__" ? "" : value,
    }));
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
        <h1 className="text-2xl font-bold mb-6">Ürün Arama</h1>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                {['anaGrupIsmi', 'markaIsmi', 'stokIsmi', 'formulasyonIsmi', 'agirlikBirimIsmi'].map((column) => (
                  <th key={column} className="border border-gray-300 px-4 py-2">
                    <div className="flex flex-col space-y-1">
                      <span>{column}</span>
                      <Select onValueChange={(value) => handleFilterChange(column, value)}>
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="Filter" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          {uniqueValues[column].map((value) => (
                            <SelectItem key={value || "__EMPTY__"} value={value || "__EMPTY__"}>
                              {value || "No Value"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </th>
                ))}
                <th className="border border-gray-300 px-4 py-2">Adet</th>
                <th className="border border-gray-300 px-4 py-2">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((product, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  {['anaGrupIsmi', 'markaIsmi', 'stokIsmi', 'formulasyonIsmi', 'agirlikBirimIsmi'].map((column) => (
                    <td key={column} className="border border-gray-300 px-4 py-2">{product[column]}</td>
                  ))}
                  <td className="border border-gray-300 px-4 py-2">
                    <Input
                      type="number"
                      min="0"
                      value={quantities[product.stokIsmi] || ''}
                      onChange={(e) => handleQuantityChange(product.stokIsmi, e.target.value)}
                      className="w-20 px-2 py-1"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <Button
                      onClick={() => handleAddToCart(product.stokIsmi)}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded"
                    >
                      Sepete Ekle
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
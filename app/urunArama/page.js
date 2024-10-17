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
import { Plus, Minus, MoreVertical } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";

export default function ProductSearch() {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    anaGrupIsmi: '',
    altGrupIsmi: '',
    markaIsmi: '',
    stokIsmi: '',
    formulasyonIsmi: '',
    agirlikBirimIsmi: ''
  });
  const [quantities, setQuantities] = useState({});
  const [selectedUnits, setSelectedUnits] = useState({});
  const [cart, setCart] = useState([]);
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
        (filters.altGrupIsmi === "" || product.altGrupIsmi === filters.altGrupIsmi) &&
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
      altGrupIsmi: Array.from(new Set(filteredItems.map(product => product.altGrupIsmi))),
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

  const handleQuantityChange = (stokIsmi, delta, unit = 'adet') => {
    setQuantities(prev => {
      const currentQuantity = prev[stokIsmi]?.[unit] || 0;
      const newQuantity = Math.max(0, currentQuantity + delta);
      return {
        ...prev,
        [stokIsmi]: {
          ...prev[stokIsmi],
          [unit]: newQuantity
        }
      };
    });
  };

  const handleUnitChange = (stokIsmi, unit) => {
    setSelectedUnits(prev => ({
      ...prev,
      [stokIsmi]: unit
    }));
  };

  const handleAddToCart = (stokIsmi) => {
    const selectedUnit = selectedUnits[stokIsmi] || 'adet';
    const quantity = quantities[stokIsmi]?.[selectedUnit] || 0;
    const totalProducts = 
      selectedUnit === 'adet' ? quantity :
      selectedUnit === 'box' ? quantity * 20 :
      selectedUnit === 'palette' ? quantity * 36 * 20 : 0;

    if (totalProducts > 0) {
      setCart(prevCart => [...prevCart, { stokIsmi, quantity: totalProducts, unit: selectedUnit }]);
      setQuantities(prev => ({ ...prev, [stokIsmi]: { adet: 0, box: 0, palette: 0 } }));
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
                {['anaGrupIsmi', 'altGrupIsmi', 'markaIsmi', 'stokIsmi', 'formulasyonIsmi', 'agirlikBirimIsmi'].map((column) => (
                  <th key={column} className="border border-gray-300 px-4 py-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{column}</span>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <div className="grid gap-4">
                            <div className="space-y-2">
                              <h4 className="font-medium leading-none">Filter {column}</h4>
                              <Select onValueChange={(value) => handleFilterChange(column, value)}>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select filter" />
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
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </th>
                ))}
                <th className="border border-gray-300 px-4 py-2">Birim</th>
                <th className="border border-gray-300 px-4 py-2">Miktar</th>
                <th className="border border-gray-300 px-4 py-2">Toplam Ürün</th>
                <th className="border border-gray-300 px-4 py-2">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((product, index) => {
                const selectedUnit = selectedUnits[product.stokIsmi] || 'adet';
                const quantity = quantities[product.stokIsmi]?.[selectedUnit] || 0;
                const totalProducts = 
                  selectedUnit === 'adet' ? quantity :
                  selectedUnit === 'box' ? quantity * 20 :
                  selectedUnit === 'palette' ? quantity * 36 * 20 : 0;

                return (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    {['anaGrupIsmi', 'altGrupIsmi', 'markaIsmi', 'stokIsmi', 'formulasyonIsmi', 'agirlikBirimIsmi'].map((column) => (
                      <td key={column} className="border border-gray-300 px-4 py-2">{product[column]}</td>
                    ))}
                    <td className="border border-gray-300 px-4 py-2">
                      <Select 
                        value={selectedUnit} 
                        onValueChange={(value) => handleUnitChange(product.stokIsmi, value)}
                      >
                        <SelectTrigger className="w-[100px]">
                          <SelectValue placeholder="Unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="adet">Adet</SelectItem>
                          <SelectItem value="box">Box</SelectItem>
                          <SelectItem value="palette">Palette</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <div className="flex items-center">
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => handleQuantityChange(product.stokIsmi, -1, selectedUnit)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input 
                          type="number" 
                          min="0" 
                          value={quantity} 
                          onChange={(e) => handleQuantityChange(product.stokIsmi, parseInt(e.target.value) - quantity, selectedUnit)}
                          className="w-16 mx-2 text-center"
                        />
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => handleQuantityChange(product.stokIsmi, 1, selectedUnit)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                    <td className="border border-gray-300 px-4 py-2">{totalProducts}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <Button
                        onClick={() => handleAddToCart(product.stokIsmi)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-sm"
                      >
                        Add to Cart
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <Button
            onClick={() => {
              if (session?.user?.id) {
                cart.forEach(item => dispatch(addToCart({ userId: session.user.id, ...item })));
                setCart([]);
              } else {
                alert("Please log in to add items to your cart.");
              }
            }}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Add Selected to Cart
          </Button>
          <span>{cart.length} items selected</span>
        </div>
      </div>
    </Layout>
  );
}
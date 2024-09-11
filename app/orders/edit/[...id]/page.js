"use client";
import Layout from '@/app/components/Layout';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from '@/app/components/modal'; // Assume you have a Modal component

export default function EditOrder() {
    const [orderInfo, setOrderInfo] = useState(null);
    const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
    const [anaGruplar, setAnaGruplar] = useState([]);
    const [selectedAnaGrup, setSelectedAnaGrup] = useState(null);
    const [markalar, setMarkalar] = useState([]);
    const [selectedMarka, setSelectedMarka] = useState(null);
    const [stoklar, setStoklar] = useState([]);
    const [selectedStok, setSelectedStok] = useState(null);
    const [newItemQuantity, setNewItemQuantity] = useState(1);
    
    const params = useParams();
    const { id } = params;
    const router = useRouter();

    useEffect(() => {
        if (!id) return;
        axios.get(`/api/orders/${id}`).then(response => {
            setOrderInfo(response.data);
        });
        fetchAnaGruplar();
    }, [id]);

    const fetchAnaGruplar = async () => {
        const response = await axios.get('/api/setoProduct/anagrup');
        setAnaGruplar(response.data);
    };

    const fetchMarkalar = async (anaGrup) => {
        const response = await axios.get(`/api/setoProduct/marka?anaGrup=${encodeURIComponent(anaGrup)}`);
        setMarkalar(response.data);
    };

    const fetchStoklar = async (marka) => {
        const response = await axios.get(`/api/setoProduct/stok?markaIsmi=${encodeURIComponent(marka)}`);
        setStoklar(response.data);
    };

    const handleQuantityChange = (index, newQuantity) => {
        setOrderInfo(prevState => {
            const newItems = [...prevState.items];
            newItems[index] = { ...newItems[index], quantity: parseInt(newQuantity) };
            return { ...prevState, items: newItems };
        });
    };

    const handleDeleteItem = (index) => {
        setOrderInfo(prevState => {
            const newItems = prevState.items.filter((_, i) => i !== index);
            return { ...prevState, items: newItems };
        });
    };

    const handleAddNewItem = () => {
        if (selectedStok && newItemQuantity > 0) {
            setOrderInfo(prevState => ({
                ...prevState,
                items: [...prevState.items, { stokIsmi: selectedStok, quantity: newItemQuantity }]
            }));
            setIsAddItemModalOpen(false);
            setSelectedAnaGrup(null);
            setSelectedMarka(null);
            setSelectedStok(null);
            setNewItemQuantity(1);
        }
    };

    const saveOrder = async (ev) => {
        ev.preventDefault();
        try {
            await axios.put(`/api/orders/${id}`, orderInfo);
            router.push('/orders');
        } catch (error) {
            console.error('Failed to update order:', error);
        }
    };

    if (!orderInfo) return <Layout><div>Loading...</div></Layout>;

    return (
        <Layout>
            <h1 className="text-2xl font-bold mb-4">Sipariş Düzenle</h1>
            <form onSubmit={saveOrder}>
                <div className="mb-4">
                    <p><strong>Sipariş ID:</strong> {orderInfo._id}</p>
                    <p><strong>Tarih:</strong> {new Date(orderInfo.createdAt).toLocaleString()}</p>
                </div>
                <div className="mb-4">
                    <h2 className="text-xl font-bold mb-2">Ürünler</h2>
                    {orderInfo.items.map((item, index) => (
                        <div key={index} className="flex items-center mb-2">
                            <span className="mr-2">{item.stokIsmi}</span>
                            <input 
                                type="number" 
                                value={item.quantity} 
                                onChange={(e) => handleQuantityChange(index, e.target.value)}
                                className="border rounded px-2 py-1 w-20 mr-2"
                                min="1"
                            />
                            <button 
                                type="button"
                                onClick={() => handleDeleteItem(index)}
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                            >
                                X
                            </button>
                        </div>
                    ))}
                </div>
                <button 
                    type="button"
                    onClick={() => setIsAddItemModalOpen(true)}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4"
                >
                    Yeni Ürün Ekle
                </button>
                <br />
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Değişiklikleri Kaydet
                </button>
            </form>

            <Modal isOpen={isAddItemModalOpen} onClose={() => setIsAddItemModalOpen(false)}>
                <h2 className="text-xl font-bold mb-4">Yeni Ürün Ekle</h2>
                <div className="mb-4">
                    <label className="block mb-2">Ana Grup</label>
                    <select 
                        value={selectedAnaGrup || ''} 
                        onChange={(e) => { 
                            setSelectedAnaGrup(e.target.value);
                            fetchMarkalar(e.target.value);
                        }}
                        className="w-full border rounded px-2 py-1"
                    >
                        <option value="">Seçiniz</option>
                        {anaGruplar.map((ag) => (
                            <option key={ag._id} value={ag.anaGrupIsmi}>{ag.anaGrupIsmi}</option>
                        ))}
                    </select>
                </div>
                {selectedAnaGrup && (
                    <div className="mb-4">
                        <label className="block mb-2">Marka</label>
                        <select 
                            value={selectedMarka || ''} 
                            onChange={(e) => { 
                                setSelectedMarka(e.target.value);
                                fetchStoklar(e.target.value);
                            }}
                            className="w-full border rounded px-2 py-1"
                        >
                            <option value="">Seçiniz</option>
                            {markalar.map((m) => (
                                <option key={m._id} value={m.markaIsmi}>{m.markaIsmi}</option>
                            ))}
                        </select>
                    </div>
                )}
                {selectedMarka && (
                    <div className="mb-4">
                        <label className="block mb-2">Stok</label>
                        <select 
                            value={selectedStok || ''} 
                            onChange={(e) => setSelectedStok(e.target.value)}
                            className="w-full border rounded px-2 py-1"
                        >
                            <option value="">Seçiniz</option>
                            {stoklar.map((s) => (
                                <option key={s._id} value={s.stokIsmi}>{s.stokIsmi}</option>
                            ))}
                        </select>
                    </div>
                )}
                <div className="mb-4">
                    <label className="block mb-2">Miktar</label>
                    <input 
                        type="number" 
                        value={newItemQuantity} 
                        onChange={(e) => setNewItemQuantity(parseInt(e.target.value))}
                        className="w-full border rounded px-2 py-1"
                        min="1"
                    />
                </div>
                <button 
                    onClick={handleAddNewItem}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Ekle
                </button>
            </Modal>
        </Layout>
    );
}
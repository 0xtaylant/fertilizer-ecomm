'use client';
import axios from "axios";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { set } from "mongoose";

export default function Categories() {
    const [name, setName] = useState('');
    const [categories, setCategories] = useState([]);

    async function fetchCategories() {
        try {
            const res = await axios.get('/api/category');
            setCategories(res.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    }

    async function saveCategory(ev) {
        ev.preventDefault();
        try {
            const response = await axios.post('/api/category', { name });
            setCategories(prev => [...prev, response.data]);
            setName('');
            fetchCategories(); 
        } catch (error) {
            console.error("Error saving category:", error);
        }
    }
    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <Layout>
            <h1>Categories</h1>
            <label>
                New Category Name
            </label>
            <form onSubmit={saveCategory} className="flex gap-1 max-w-[60%]">
                <input
                    className="mb-0"
                    type="text"
                    placeholder={'Category Name'}
                    onChange={ev => setName(ev.target.value)}
                    value={name} />
                <button type="submit" className="btn-primary" > Save </button>
            </form>
            <table className="basic mt-4">
                <thead>
                    <tr>
                        <td>
                            Category Name
                        </td>
                    </tr>
                </thead>
                <tbody>
                    {categories && categories.length > 0 ? categories.map(category => (
                        <tr key={category._id}>
                            <td>{category.name}</td>
                        </tr>
                    )) : (
                        <tr>
                            <td>No categories found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </Layout>
    );
}

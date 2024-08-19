'use client';
import axios from "axios";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { set } from "mongoose";

export default function Categories() {
    const [editedCategory, setEditedCategory] = useState('');
    const [name, setName] = useState('');
    const [parentCategory, setParentCategory] = useState('0');
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
        const data = { name, parentCategory };
        try {
            if (editedCategory) {
                data._id = editedCategory._id;
                const response = await axios.put('/api/category', data);
                setCategories(prev => [...prev, response.data]);
                setEditedCategory(null);
            } else {
                const response = await axios.post('/api/category', data);
                setCategories(prev => [...prev, response.data]);
            }

            setName('');
            fetchCategories();
        } catch (error) {
            console.error("Error saving category:", error);
        }
    }
    useEffect(() => {
        fetchCategories();
    }, []);

    function editCategory(category) {
        setEditedCategory(category);
        setName(category.name);
        setParentCategory(category.parent?._id);
    }
    return (
        <Layout>
            <h1>Categories</h1>
            <label>
                {editedCategory ? `Edit Category ${editedCategory.name}` : 'New Category Name'}
            </label>
            <form onSubmit={saveCategory} className="flex gap-1 max-w-[60%]">
                <input
                    className="mb-0"
                    type="text"
                    placeholder={'Category Name'}
                    onChange={ev => setName(ev.target.value)}
                    value={name} />
                <select className="mb-0"
                    onChange={ev => setParentCategory(ev.target.value)}
                    value={parentCategory}>
                    <option value="0">No parent category</option>
                    {categories.length > 0 && categories.map(category => (
                        <option value={category._id}>{category.name}</option>
                    ))}
                </select>
                <button type="submit" className="btn-primary" > Save </button>
            </form>
            <table className="basic mt-4">
                <thead>
                    <tr>
                        <td>
                            Category Name
                        </td>
                        <td>
                            Parent Category
                        </td>
                    </tr>
                </thead>
                <tbody>
                    {categories && categories.length > 0 ? categories.map(category => (
                        <tr key={category._id}>
                            <td>{category.name}</td>
                            <td>{category?.parent?.name}</td>
                            <td>
                                <button onClick={() => editCategory(category)}
                                    className="btn-primary mr-2">
                                    Edit
                                </button>
                                <button className="btn-primary">Delete</button>
                            </td>
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

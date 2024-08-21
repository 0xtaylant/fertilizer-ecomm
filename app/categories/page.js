'use client';
import axios from "axios";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export default function Categories() {
    const [editedCategory, setEditedCategory] = useState(null);
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
        const data = { name, parentCategory: parentCategory === '0' ? null : parentCategory };
        try {
            if (editedCategory) {
                data._id = editedCategory._id;
                await axios.put('/api/category', data);
            } else {
                await axios.post('/api/category', data);
            }
            setName('');
            setEditedCategory(null);
            fetchCategories();
        } catch (error) {
            console.error("Error saving category:", error);
        }
    }

    function editCategory(category) {
        setEditedCategory(category);
        setName(category.name);
        setParentCategory(category.parent?._id || '0');
    }

    function deleteCategory(category) {
        MySwal.fire({
            title: 'Are you sure?',
            text: `Do you want to delete ${category.name}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`/api/category?id=${category._id}`);
                    fetchCategories();
                    MySwal.fire(
                        'Deleted!',
                        'Your category has been deleted.',
                        'success'
                    );
                } catch (error) {
                    console.error("Error deleting category:", error);
                    MySwal.fire(
                        'Error!',
                        'Failed to delete the category.',
                        'error'
                    );
                }
            }
        });
    }

    useEffect(() => {
        fetchCategories();
    }, []);
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
                    {categories.length > 0 ? categories.map(category => (
                        <tr key={category._id}>
                            <td>{category.name}</td>
                            <td>{category?.parent?.name}</td>
                            <td>
                                <button onClick={() => editCategory(category)}
                                    className="btn-primary mr-2">
                                    Edit
                                </button>
                                <button onClick={() => deleteCategory(category)}
                                    className="btn-primary">
                                    Delete
                                </button>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="3">No categories found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </Layout>
    );
}

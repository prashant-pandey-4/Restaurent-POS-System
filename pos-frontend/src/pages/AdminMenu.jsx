import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminMenu = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [newItem, setNewItem] = useState({ name: '', price: '', category: '', imageUrl: '', isAvailable: true });
    const [editingItem, setEditingItem] = useState(null);
    const navigate = useNavigate();

    // ✅ Centralized Base URL
    const API_BASE_URL = "https://restaurent-pos-system.onrender.com";

    useEffect(() => {
        if (localStorage.getItem('isAdmin') !== 'true') {
            navigate('/login');
        } else {
            fetchMenu();
        }
    }, [navigate]);

    const fetchMenu = async () => {
        try {
            // ✅ Fixed: Added /menu at the end
            const res = await fetch(`${API_BASE_URL}/menu`);
            const data = await res.json();
            const finalData = data.menuItems ? data.menuItems : (Array.isArray(data) ? data : []);
            setMenuItems(finalData);
        } catch (err) {
            console.error("Fetch error:", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Image logic: ensure it starts with / only if it's a local path, not a full URL
        let formattedImageUrl = newItem.imageUrl;
        if (formattedImageUrl && !formattedImageUrl.startsWith('http') && !formattedImageUrl.startsWith('/')) {
            formattedImageUrl = `/${formattedImageUrl}`;
        }
        
        const payload = {
            ...newItem,
            imageUrl: formattedImageUrl
        };

        // ✅ Fixed: Removed /api/v1 from these URLs
        const url = editingItem 
            ? `${API_BASE_URL}/menu/update/${editingItem._id}` 
            : `${API_BASE_URL}/menu/add`;
        
        const method = editingItem ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                alert(editingItem ? "Update ho gaya!" : "Add ho gaya!");
                setNewItem({ name: '', price: '', category: '', imageUrl: '', isAvailable: true });
                setEditingItem(null);
                await fetchMenu(); // Refresh list
            } else {
                alert("Server Error: Database update nahi hua.");
            }
        } catch (error) {
            alert("Backend connected nahi hai!");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Kya aap ise delete karna chahte hain?")) {
            try {
                // ✅ Fixed: Correct delete URL
                const res = await fetch(`${API_BASE_URL}/menu/delete/${id}`, { method: 'DELETE' });
                if (res.ok) {
                    alert("Deleted!");
                    fetchMenu();
                }
            } catch (err) {
                alert("Delete fail!");
            }
        }
    };

    const startEdit = (item) => {
        setEditingItem(item);
        setNewItem({ 
            name: item.name, 
            price: item.price, 
            category: item.category, 
            imageUrl: item.imageUrl || '', 
            isAvailable: item.isAvailable 
        });
        window.scrollTo(0, 0); 
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-indigo-700 uppercase">Admin - Menu Control</h1>
                <button onClick={() => navigate('/')} className="bg-gray-600 text-white px-4 py-2 rounded shadow hover:bg-gray-700 transition">Back to POS</button>
            </div>
            
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md mb-8 grid grid-cols-1 md:grid-cols-2 gap-4 border-t-4 border-indigo-500">
                <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-600 mb-1">Item Name</label>
                    <input type="text" placeholder="e.g. Paneer Tikka" className="border rounded p-2 focus:ring-2 focus:ring-indigo-300 outline-none" value={newItem.name} onChange={(e) => setNewItem({...newItem, name: e.target.value})} required />
                </div>
                <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-600 mb-1">Price (₹)</label>
                    <input type="number" placeholder="e.g. 250" className="border rounded p-2 focus:ring-2 focus:ring-indigo-300 outline-none" value={newItem.price} onChange={(e) => setNewItem({...newItem, price: e.target.value})} required />
                </div>
                <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-600 mb-1">Category</label>
                    <input type="text" placeholder="e.g. Starter" className="border rounded p-2 focus:ring-2 focus:ring-indigo-300 outline-none" value={newItem.category} onChange={(e) => setNewItem({...newItem, category: e.target.value})} required />
                </div>
                <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-600 mb-1">Image Filename</label>
                    <input type="text" placeholder="e.g. paneer.jpg" className="border rounded p-2 focus:ring-2 focus:ring-indigo-300 outline-none" value={newItem.imageUrl} onChange={(e) => setNewItem({...newItem, imageUrl: e.target.value})} />
                </div>
                
                <button type="submit" className={`col-span-full py-3 rounded-lg font-bold text-white shadow-lg transition transform hover:scale-[1.01] active:scale-[0.99] ${editingItem ? 'bg-orange-500 hover:bg-orange-600' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
                    {editingItem ? "💾 UPDATE ITEM DETAILS" : "➕ ADD ITEM TO MENU"}
                </button>
                {editingItem && (
                    <button type="button" onClick={() => {setEditingItem(null); setNewItem({name:'', price:'', category:'', imageUrl:'', isAvailable:true})}} className="col-span-full text-gray-500 text-sm underline mt-1">Cancel Editing</button>
                )}
            </form>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {menuItems.map(item => (
                    <div key={item._id} className="bg-white p-4 flex justify-between items-center rounded-lg shadow-sm border hover:border-indigo-200 transition">
                        <div className="flex items-center gap-4">
                            <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden border">
                                <img 
                                    src={item.imageUrl.startsWith('http') ? item.imageUrl : item.imageUrl} 
                                    alt={item.name} 
                                    className="w-full h-full object-cover" 
                                    onError={(e) => { e.target.src="https://via.placeholder.com/150?text=No+Image"; }} 
                                />
                            </div>
                            <div>
                                <p className="font-bold text-lg text-gray-800">{item.name}</p>
                                <p className="text-green-600 font-bold">₹{item.price}</p>
                                <p className="text-xs text-gray-400">Path: {item.imageUrl}</p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <button onClick={() => startEdit(item)} className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-md border border-blue-200 hover:bg-blue-600 hover:text-white transition">Edit</button>
                            <button onClick={() => handleDelete(item._id)} className="bg-red-50 text-red-600 px-4 py-1.5 rounded-md border border-red-200 hover:bg-red-600 hover:text-white transition">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminMenu;

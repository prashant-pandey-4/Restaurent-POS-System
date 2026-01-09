import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminMenu = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [newItem, setNewItem] = useState({ name: '', price: '', category: '', imageUrl: '', isAvailable: true });
    const [editingItem, setEditingItem] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('isAdmin') !== 'true') {
            navigate('/login');
        } else {
            fetchMenu();
        }
    }, [navigate]);

    const fetchMenu = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/v1/menu');
            const data = await res.json();
            const finalData = data.menuItems ? data.menuItems : (Array.isArray(data) ? data : []);
            setMenuItems(finalData);
        } catch (err) {
            console.error("Fetch error:", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Agar image name ke aage / nahi hai toh laga do (taaki public folder se uth sake)
        const formattedImageUrl = newItem.imageUrl.startsWith('/') ? newItem.imageUrl : `/${newItem.imageUrl}`;
        
        const payload = {
            ...newItem,
            imageUrl: formattedImageUrl
        };

        const url = editingItem 
            ? `http://localhost:5000/api/v1/menu/update/${editingItem._id}` 
            : 'http://localhost:5000/api/v1/menu/add';
        
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
                await fetchMenu(); // List refresh
                navigate('/'); // Seedha Dashboard par bhej dega
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
                const res = await fetch(`http://localhost:5000/api/v1/menu/delete/${id}`, { method: 'DELETE' });
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
            <h1 className="text-2xl font-bold mb-6 text-indigo-700 uppercase">Admin - Menu Control</h1>
            
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md mb-8 grid grid-cols-1 md:grid-cols-2 gap-4 border-t-4 border-indigo-500">
                <input type="text" placeholder="Item Name" className="border rounded p-2" value={newItem.name} onChange={(e) => setNewItem({...newItem, name: e.target.value})} required />
                <input type="number" placeholder="Price (₹)" className="border rounded p-2" value={newItem.price} onChange={(e) => setNewItem({...newItem, price: e.target.value})} required />
                <input type="text" placeholder="Category" className="border rounded p-2" value={newItem.category} onChange={(e) => setNewItem({...newItem, category: e.target.value})} required />
                <input type="text" placeholder="Image Name (e.g. cold-coffee.webp)" className="border rounded p-2" value={newItem.imageUrl} onChange={(e) => setNewItem({...newItem, imageUrl: e.target.value})} />
                
                <button type="submit" className={`col-span-full py-3 rounded-lg font-bold text-white transition ${editingItem ? 'bg-orange-500' : 'bg-indigo-600'}`}>
                    {editingItem ? "💾 UPDATE ITEM" : "➕ ADD NEW ITEM"}
                </button>
            </form>

            <div className="grid gap-4">
                {menuItems.map(item => (
                    <div key={item._id} className="bg-white p-4 flex justify-between items-center rounded-lg shadow-sm border">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden">
                                <img src={item.imageUrl} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.src="https://via.placeholder.com/100?text=No+Img"; }} />
                            </div>
                            <div>
                                <p className="font-bold">{item.name}</p>
                                <p className="text-sm text-gray-500">File: <span className="text-indigo-500">{item.imageUrl}</span></p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => startEdit(item)} className="text-blue-600 px-3 py-1 border border-blue-600 rounded hover:bg-blue-50">Edit</button>
                            <button onClick={() => handleDelete(item._id)} className="text-red-600 px-3 py-1 border border-red-600 rounded hover:bg-red-50">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminMenu;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [user, setUser] = useState("");
    const [pass, setPass] = useState("");
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        
        if ((user === "admin" && pass === "admin123") || (user === "owner" && pass === "owner123")) {
            localStorage.setItem("isAdmin", "true"); // Session lock
            navigate("/admin/menu"); // Redirect to manage page
        } else {
            alert("Galat password ya username!");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-bold text-center mb-6">Admin Login</h2>
                <form onSubmit={handleLogin}>
                    <input 
                        type="text" placeholder="Username" className="w-full p-2 mb-4 border rounded"
                        onChange={(e) => setUser(e.target.value)} required
                    />
                    <input 
                        type="password" placeholder="Password" className="w-full p-2 mb-6 border rounded"
                        onChange={(e) => setPass(e.target.value)} required
                    />
                    <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">
                        Login 
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
import React from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/shared/Sidebar";
import Header from "../components/shared/Header";
import MenuDisplay from "../components/MenuDisplay";
import OrderCart from "../components/OrderCart";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <div className="w-20 flex-shrink-0">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="p-4 sticky top-0 bg-gray-50 z-10 flex justify-between items-center">
          <Header />
          <div className="flex items-center">
            <button
              onClick={() => navigate("/orders")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200 ml-4"
            >
              📋 Order Dashboard
            </button>
            <button
              onClick={() => navigate("/login")}
              className="bg-gray-800 hover:bg-black text-white font-semibold py-2 px-4 rounded-lg shadow-md ml-2"
            >
              ⚙️ Admin
            </button>
          </div>
        </div>

        <div className="p-4 flex-1">
          <MenuDisplay />
        </div>
      </div>

      <div className="w-96 flex-shrink-0 bg-white shadow-2xl border-l border-gray-200">
        <OrderCart />
      </div>
    </div>
  );
};

export default Home;
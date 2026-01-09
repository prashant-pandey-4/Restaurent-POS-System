import React from "react";

const Header = () => {
  return (
    <header className="flex justify-between items-center py-4 border-b border-gray-200">
      <div>
        <h1 className="text-3xl font-bold text-yellow-800">
          Real Taste Family Restaurent
        </h1>
        <p className="text-sm text-gray-500">Welcome, Cashier (Table Orders)</p>
      </div>

      <div className="flex space-x-4 items-center">
      
        <input
          type="text"
          placeholder="Search dishes or tables..."
          className="p-2 border border-gray-300 rounded-lg w-64 focus:ring-yellow-500 focus:border-yellow-500"
        />
        
        <span className="text-gray-600 font-medium">
          {new Date().toLocaleDateString("en-IN", {
            weekday: "short",
            month: "short",
            day: "numeric",
          })}
        </span>
      </div>
    </header>
  );
};

export default Header;

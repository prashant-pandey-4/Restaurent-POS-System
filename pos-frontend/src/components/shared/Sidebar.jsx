import React from "react";

const Icon = ({ children }) => <span className="text-xl p-3">{children}</span>;

const Sidebar = () => {
  return (
    <div className="flex flex-col items-center py-6 h-full bg-gray-800 text-white shadow-xl">
      <div className="text-2xl font-bold mb-10 text-yellow-400">
        RT
      </div>

      <nav className="flex flex-col space-y-4">
        <a
          href="#"
          className="p-3 rounded-xl bg-yellow-600 text-white shadow-lg"
        >
          <Icon>📋</Icon>
        </a>
        <a href="#" className="p-3 rounded-xl hover:bg-gray-700 transition">
          <Icon>📊</Icon>
        </a>
        <a href="#" className="p-3 rounded-xl hover:bg-gray-700 transition">
          <Icon>⚙️</Icon>
        </a>
      </nav>

      <div className="mt-auto p-3 rounded-xl hover:bg-gray-700 transition">
        <Icon>👤</Icon>
      </div>
    </div>
  );
};

export default Sidebar;
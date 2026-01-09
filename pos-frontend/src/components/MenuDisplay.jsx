import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMenu } from "../store/actions/menuActions";
import { addItemToCart } from "../store/actions/orderActions";

const MenuDisplay = () => {
  const { menuItems, loading, error } = useSelector((state) => state.menu);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchMenu());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="text-center p-4 text-xl font-medium">Loading menu...</div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-center p-4 text-xl">
        Error loading menu: {error}
      </div>
    );
  }

  if (!menuItems || !Array.isArray(menuItems) || menuItems.length === 0) {
    return (
      <div className="text-gray-500 text-center p-4 mt-10 text-lg">
        No menu items found. Please check your Backend database.
      </div>
    );
  }

  return (
    <div className="p-4 h-full overflow-y-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {menuItems.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 overflow-hidden cursor-pointer border border-gray-100"
            onClick={() => dispatch(addItemToCart(item))}
          >
   <div className="w-full h-32 bg-gray-200 flex items-center justify-center">
  {/* Yahan 'item.imageUrl' use karein kyunki DB mein yahi naam hai */}
  {item.imageUrl ? (
    <img 
      src={item.imageUrl} 
      alt={item.name} 
      className="w-full h-full object-cover"
      onError={(e) => {
        // Agar /paneer-tikka.jpg nahi chala, toh bina slash wala try karein
        if (!e.target.src.includes('via.placeholder')) {
           e.target.src = item.imageUrl.startsWith('/') ? item.imageUrl.substring(1) : item.imageUrl;
        }
      }}
    />
  ) : (
    <span className="text-gray-500">No Image Name in DB</span>
  )}
</div>

            <div className="p-3">
              <h3 className="text-lg font-bold text-gray-800 truncate">
                {item.name}
              </h3>
              <p className="text-sm text-gray-500">{item.category}</p>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-xl font-extrabold text-green-600">
                  ₹{item.price ? item.price.toFixed(2) : "0.00"}
                </span>
                <button className="bg-orange-500 text-white text-sm px-3 py-1 rounded-full hover:bg-orange-600 transition-colors">
                  Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuDisplay;
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const OrderListPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Sabse upar apna Backend Base URL rakh dete hain taaki change karna aasaan ho
  const API_BASE_URL = "https://restaurent-pos-system.onrender.com";

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      // ✅ Fixed: Localhost hataya aur /api/v1 bhi
      const response = await fetch(`${API_BASE_URL}/order`); 
      const data = await response.json();

      // Backend array bhej raha hai toh set kar do
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      alert("Failed to load orders. Please check if Backend is awake.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    if (
      !window.confirm(
        `Are you sure you want to mark Order #${orderId.substring(18)} as ${newStatus}?`
      )
    ) {
      return;
    }

    try {
      // ✅ Fixed: Update status URL bhi sahi kar diya
      const response = await fetch(
        `${API_BASE_URL}/order/update-status/${orderId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: newStatus,
            paymentDetails:
              newStatus === "Completed"
                ? { completedAt: new Date().toISOString() }
                : undefined,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert(`Status updated to ${newStatus}!`);
        fetchOrders(); // List refresh karo
      } else {
        alert("Failed to update status: " + (data.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Status update error:", error);
      alert("A critical error occurred while updating the order status.");
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending": return "bg-yellow-100 text-yellow-800";
      case "Paid": return "bg-blue-100 text-blue-800";
      case "Completed": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xl font-semibold">Loading Dashboard Orders...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 flex justify-between items-center">
        Order Dashboard 📋
        <button
          onClick={() => navigate("/")}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm"
        >
          ← Back to POS
        </button>
      </h1>

      <div className="overflow-x-auto bg-white shadow-xl rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-12 text-center text-gray-500 text-lg">
                  No active orders found. Try placing an order from the menu.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-indigo-600">
                    #{order._id.substring(18)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.orderTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
                    {order.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-extrabold text-gray-900">
                    ₹{order.totalAmount ? order.totalAmount.toFixed(2) : "0.00"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyle(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                    {order.status === "Pending" && (
                      <button onClick={() => handleUpdateStatus(order._id, "Paid")} className="text-blue-600 hover:text-blue-900 font-bold underline">
                        Mark Paid
                      </button>
                    )}
                    {(order.status === "Paid" || order.status === "Served") && (
                      <button onClick={() => handleUpdateStatus(order._id, "Completed")} className="text-green-600 hover:text-green-900 font-bold underline">
                        Complete
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderListPage;

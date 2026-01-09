import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const OrderListPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/v1/order"); // GET /api/v1/order
      const data = await response.json();

      // Assuming the backend returns an array of orders directly
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      alert("Failed to load orders. Check your backend server.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  
  const handleUpdateStatus = async (orderId, newStatus) => {
    if (
      !window.confirm(
        `Are you sure you want to mark Order #${orderId.substring(
          18
        )} as ${newStatus}?`
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/order/update-status/${orderId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: newStatus,
            // Optional: Payment details sirf 'Paid' status ke liye
            paymentDetails:
              newStatus === "Completed"
                ? { completedAt: new Date().toISOString() }
                : undefined,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        alert(`Status updated to ${newStatus}!`);
        fetchOrders(); // List ko refresh karein
      } else {
        alert("Failed to update status: " + data.message);
      }
    } catch (error) {
      console.error("Status update error:", error);
      alert("A critical error occurred while updating the order status.");
    }
  };

  // Helper function for styling based on status
  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Paid":
        return "bg-blue-100 text-blue-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xl">Loading Orders...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 flex justify-between items-center">
        Order Dashboard 📋
        <button
          onClick={() => navigate("/")}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          ← Back to POS
        </button>
      </h1>

      <div className="overflow-x-auto bg-white shadow-xl rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Items
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-8 text-center text-gray-500">
                  No active orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order._id.substring(18)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.orderTime).toLocaleTimeString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
                    {order.items
                      .map((i) => `${i.quantity}x ${i.name}`)
                      .join(", ")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    ₹{order.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyle(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {order.status === "Pending" && (
                      <button
                        onClick={() => handleUpdateStatus(order._id, "Paid")}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Mark Paid
                      </button>
                    )}
                    {(order.status === "Paid" || order.status === "Served") && (
                      <button
                        onClick={() =>
                          handleUpdateStatus(order._id, "Completed")
                        }
                        className="text-green-600 hover:text-green-900"
                      >
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

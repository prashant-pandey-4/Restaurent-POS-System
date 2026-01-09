import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  clearCart,
  removeItemFromCart,
  increaseItemQuantity,
  decreaseItemQuantity,
} from "../store/actions/orderActions";

const OrderCart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const orderState = useSelector((state) => state.order);

  const cartItems = orderState.cartItems || [];
  const cartTotal = orderState.subTotal || 0;
  const taxAmount = orderState.taxAmount || 0;
  const grandTotal = orderState.totalAmount || 0;
  const displayTaxRate = 5;

  const handleInitiatePayment = async () => {
    if (cartItems.length === 0) {
      alert("Please add items to the cart before initiating payment.");
      return;
    }

    try {
      const orderData = {
        cartItems: cartItems.map((item) => ({
          menuItemId: item._id || item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        subTotal: cartTotal,
        tax: taxAmount,
        totalAmount: grandTotal,
        status: "Pending",
        paymentDetails: { method: "QR_PENDING" },
      };

      const response = await fetch("http://localhost:5000/api/v1/order/place", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (data.success) {
        alert(`Order (ID: ${data.order._id.substring(18)}) generated. Redirecting to Payment Screen.`);
        dispatch(clearCart());
        navigate(`/payment/${data.order._id}`, {
          state: { totalAmount: grandTotal },
        });
      } else {
        alert("Failed to initiate payment: " + data.message);
      }
    } catch (error) {
      console.error("Order initiation error:", error);
      alert("A critical error occurred while preparing the payment screen.");
    }
  };

  const handleKOTOrder = async () => {
    if (cartItems.length === 0) {
      alert("Please add items to the cart before placing a KOT order.");
      return;
    }

    try {
      const orderData = {
        cartItems: cartItems.map((item) => ({
          menuItemId: item._id || item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        subTotal: cartTotal,
        tax: taxAmount,
        totalAmount: grandTotal,
        status: "Pending",
        paymentDetails: { method: "KOT_OFFLINE" },
      };

      const response = await fetch("http://localhost:5000/api/v1/order/place", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (data.success) {
        alert(`KOT Order (ID: ${data.order._id.substring(18)}) placed successfully!`);
        dispatch(clearCart());
      } else {
        alert("Failed to place KOT order: " + data.message);
      }
    } catch (error) {
      console.error("KOT Order Save Error:", error);
      alert("A critical error occurred while placing the KOT order.");
    }
  };

  return (
    <div className="bg-white p-4 shadow-lg flex flex-col h-full">
      <h2 className="text-xl font-bold mb-4 border-b pb-2">Order Cart</h2>

      <div className="flex-grow overflow-y-auto space-y-3 pr-2">
        {cartItems.length === 0 ? (
          <p className="text-gray-500 text-center mt-10">
            Cart is empty. Add items from the menu.
          </p>
        ) : (
          <div className="space-y-3">
            {cartItems.map((item) => (
              <div
                key={item._id || item.id}
                className="flex justify-between items-center p-2 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => dispatch(decreaseItemQuantity(item._id || item.id))}
                    className="w-6 h-6 bg-red-100 text-red-600 rounded-full font-bold"
                  >
                    -
                  </button>
                  <span className="font-bold w-4 text-center">{item.quantity}</span>
                  <button
                    onClick={() => dispatch(increaseItemQuantity(item._id || item.id))}
                    className="w-6 h-6 bg-green-100 text-green-600 rounded-full font-bold"
                  >
                    +
                  </button>
                  <button
                    onClick={() => dispatch(removeItemFromCart(item._id || item.id))}
                    className="text-gray-400 hover:text-red-500 transition-colors ml-2"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 7l-.86 10.93a2 2 0 01-2 1.93H7.86a2 2 0 01-2-1.93L5 7m4 0V5a2 2 0 012-2h2a2 2 0 012 2v2m-6 0h6"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t space-y-2">
        <div className="flex justify-between font-medium text-gray-700">
          <span>Subtotal:</span>
          <span>₹{cartTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-medium text-gray-700">
          <span>GST ({displayTaxRate}%):</span>
          <span>₹{taxAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-xl text-indigo-600">
          <span>Grand Total:</span>
          <span>₹{grandTotal.toFixed(2)}</span>
        </div>
      </div>

      <button
        onClick={handleKOTOrder}
        disabled={cartItems.length === 0}
        className={`mt-4 py-3 rounded-lg font-bold text-white transition-all ${
          cartItems.length === 0
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-yellow-500 hover:bg-yellow-600"
        }`}
      >
        Place Order (KOT / Offline)
      </button>

      <button
        onClick={handleInitiatePayment}
        disabled={cartItems.length === 0}
        className={`mt-2 py-3 rounded-lg font-bold text-white transition-all ${
          cartItems.length === 0
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-indigo-600 hover:bg-indigo-700"
        }`}
      >
        Pay Now (₹{grandTotal.toFixed(2)}) via QR / Manual
      </button>

      <button
        onClick={() => dispatch(clearCart())}
        className="mt-2 py-2 rounded-lg font-medium text-red-600 bg-red-100 hover:bg-red-200 transition-colors"
      >
        Clear Cart
      </button>
    </div>
  );
};

export default OrderCart;
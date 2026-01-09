import React from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearCart } from "../store/actions/orderActions";

const PaymentScreen = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const totalAmount = location.state?.totalAmount || "N/A";
  const STATIC_QR_CODE_URL = "/images/upi_qr_code.jpeg";
  const VPA_ID = "realtasterestaurent@okaxis";
  const PAYMENT_INSTRUCTIONS = "Scan the QR code above or send the amount to the UPI ID. Click 'Mark as Paid' after a successful transaction.";

  const handlePaymentConfirmation = async () => {
    const confirm = window.confirm(
      "Confirm payment received for this order? Status will be updated to 'Paid'."
    );
    
    if (!confirm) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/order/update-status/${orderId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: "Paid",
            paymentDetails: {
              method: "UPI_QR",
              receivedAt: new Date().toISOString(),
            },
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        alert(`Order ${orderId.substring(18)} successfully marked as PAID!`);
        dispatch(clearCart());
        navigate("/");
      } else {
        alert("Failed to update order status: " + data.message);
      }
    } catch (error) {
      console.error("Payment Confirmation Error:", error);
      alert("A critical error occurred while confirming payment.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md text-center border-t-4 border-indigo-600">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-2">
          💰 Payment Due
        </h2>
        <p className="text-gray-500 mb-6">Order ID: #{orderId.substring(18)}</p>

        <div className="border border-dashed border-gray-300 p-4 rounded-lg mb-6 bg-indigo-50">
          <p className="text-xl font-semibold text-indigo-700">
            Total Payable Amount:
          </p>
          <p className="text-4xl font-bold text-indigo-600 mt-1">
            ₹{totalAmount !== "N/A" ? totalAmount.toFixed(2) : "N/A"}
          </p>
        </div>

        <div className="mb-6">
          <img
            src={STATIC_QR_CODE_URL}
            alt="UPI Payment QR Code"
            className="w-48 h-48 mx-auto p-2 border border-gray-300 rounded-lg shadow-md"
          />
          <p className="text-sm text-gray-600 mt-2 font-medium">
            UPI ID: {VPA_ID}
          </p>
        </div>

        <p className="text-sm text-red-500 mb-4">{PAYMENT_INSTRUCTIONS}</p>

        <button
          onClick={handlePaymentConfirmation}
          className="w-full bg-green-500 text-white py-3 rounded-lg font-bold text-lg hover:bg-green-600 transition-colors shadow-md"
        >
          Mark as Paid (Payment Received)
        </button>
      </div>
    </div>
  );
};

export default PaymentScreen;
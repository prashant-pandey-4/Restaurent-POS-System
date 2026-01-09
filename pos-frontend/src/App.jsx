// pos-frontend/src/App.jsx

import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Order from "./pages/Order";
import PaymentScreen from "./pages/PaymentScreen";
import OrderListPage from "./pages/OrderListPage";
import Login from "./pages/Login";
import AdminMenu from "./pages/AdminMenu";

function App() {
  return (
    
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/order" element={<Order />} />
      <Route path="/payment/:orderId" element={<PaymentScreen />} />
      <Route path="/orders" element={<OrderListPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin/menu" element={<AdminMenu />} />
    </Routes>
  );
}

export default App;

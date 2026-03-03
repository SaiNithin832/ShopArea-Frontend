import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import RegistrationPage from "./pages/RegistrationPage";
import CustomerHomePage from "./pages/CustomerHomePage";
import CartPage from "./pages/CartPage";
import OrdersPage from "./pages/OrdersPage";
import AdminDashboard from "./pages/AdminDashBoard"; // ✅ ADD THIS

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default Route */}
        <Route path="/" element={<LoginPage />} />

        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />

        {/* Customer Routes */}
        <Route path="/customerhome" element={<CustomerHomePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/orders" element={<OrdersPage />} />

        {/* ✅ Admin Route */}
        <Route path="/adminhome" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
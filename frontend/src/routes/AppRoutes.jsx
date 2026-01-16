import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import UserLayout from "../layouts/UserLayout";
import Home from "../pages/customer/Home";
import Shop from "../pages/customer/Shop";
import Cart from "../pages/customer/Cart";
import Checkout from "../pages/customer/Checkout";
import ProductDetail from "../pages/customer/ProductDetail";
import Register from "../pages/customer/Register";
import Dashboard from "../pages/admin/Dashboard";
import Finance from "../pages/admin/Finance";
import ManageInventory from "../pages/admin/ManageInventory";
import ManageOrder from "../pages/admin/ManageOrder";
import Login from "../pages/Login";
import PrivateRoute from "../components/PrivateRoute";
import Specification from "../pages/customer/Specification";
import OrderHistory from "../pages/customer/OrderHistory";
import OrderDetail from "../pages/admin/OrderDetail";
import PaySuccess from "../pages/customer/Success";
import PayFail from "../pages/customer/Failed";
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* User routes */}
      <Route path="/" element={<UserLayout />}>
        <Route index element={<Home />} />
        <Route path="Home" element={<Home />} />
        <Route path="shop" element={<Shop />} />
        <Route path="product/:id" element={<ProductDetail />} />
        <Route path="/specification" element={<Specification />} />
        <Route path="/payment/success" element={<PaySuccess />} />
        <Route path="/payment/fail" element={<PayFail />} />
        <Route
          path="cart"
          element={
            <PrivateRoute role="user">
              <Cart />
            </PrivateRoute>
          }
        />
        <Route
          path="checkout"
          element={
            <PrivateRoute role="user">
              <Checkout />
            </PrivateRoute>
          }
        />
        <Route
          path="orders"
          element={
            <PrivateRoute role="user">
              <OrderHistory />
            </PrivateRoute>
          }
        />
        <Route path="register" element={<Register />} />
      </Route>

      {/* Admin routes */}
      <Route
        path="/admin"
        element={
          <PrivateRoute role="admin">
            <AdminLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="finance" element={<Finance />} />
        <Route path="inventory" element={<ManageInventory />} />
        <Route path="orders" element={<ManageOrder />} />
        <Route path="orders/:orderId" element={<OrderDetail />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;

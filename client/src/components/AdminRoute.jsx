// /client/src/components/AdminRoute.jsx

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const AdminRoute = ({ children }) => {
  const { user } = useAuthStore();

  // This component assumes the user is already authenticated
  // because it will be nested inside a <ProtectedRoute>
  if (user && user.role !== "Admin") {
    // If user is logged in but not an Admin, send them to the dashboard
    return <Navigate to="/" replace />;
  }

  // If user is an Admin, render the page
  return children;
};

export default AdminRoute;

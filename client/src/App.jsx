// /client/src/App.jsx

import React from "react";
import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuthStore } from "./store/authStore";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Purchases from "./pages/Purchases";
import Transfers from "./pages/Transfers";
import Assignments from "./pages/Assignments";
import AdminRoute from "./components/AdminRoute";
import ManageBases from "./pages/ManageBases";
import ManageAssets from "./pages/ManageAssets";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

// --- Page Placeholders (we'll build these next) ---
const NotFound = () => <div className="p-8">404 - Page Not Found</div>;

// --- Main Layout Placeholder ---
// This will wrap our protected pages with the Sidebar and Navbar
const MainLayout = ({ children }) => {
  // State to control the sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <main className="flex-1 flex flex-col">
        <Navbar setIsSidebarOpen={setIsSidebarOpen} />
        <div className="flex-1 p-4 md:p-8 bg-brand-light">{children}</div>
      </main>
    </div>
  );
};

// --- Protected Route Component ---
// This is the gatekeeper for our protected pages
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated()) {
    // If user is not logged in, redirect them to the /login page
    return <Navigate to="/login" replace />;
  }

  // If they are logged in, show the page they requested
  return children;
};

// --- The Main App ---
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/purchases"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Purchases />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/transfers"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Transfers />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/assignments"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Assignments />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* --- ADMIN ONLY ROUTES --- */}
        <Route
          path="/manage-bases"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <MainLayout>
                  <ManageBases />
                </MainLayout>
              </AdminRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage-assets"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <MainLayout>
                  <ManageAssets />
                </MainLayout>
              </AdminRoute>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;

// /client/src/components/Sidebar.jsx

import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import {
  ChartPieIcon,
  ShoppingCartIcon,
  ArrowRightOnRectangleIcon,
  TruckIcon,
  ClipboardDocumentCheckIcon,
  HomeModernIcon,
  CubeIcon,
  UserIcon,
  XMarkIcon, // <-- For the close button
} from "@heroicons/react/24/outline";

// This is a new component for the mobile links
const NavItem = ({ to, icon: Icon, name, closeSidebar }) => {
  const activeClassName = "bg-brand-primary text-white";
  const inactiveClassName =
    "text-gray-300 hover:bg-brand-secondary hover:bg-opacity-50";

  return (
    <NavLink
      to={to}
      end
      onClick={closeSidebar} // Closes sidebar on nav click
      className={({ isActive }) =>
        `flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
          isActive ? activeClassName : inactiveClassName
        }`
      }
    >
      <Icon className="w-6 h-6 mr-3" />
      <span className="font-medium">{name}</span>
    </NavLink>
  );
};

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsSidebarOpen(false);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const getNavLinks = (role) => {
    // ... (this function is identical to before)
    const allLinks = [
      {
        to: "/",
        name: "Dashboard",
        icon: ChartPieIcon,
        roles: ["Admin", "Base Commander", "Logistics Officer"],
      },
      {
        to: "/purchases",
        name: "Purchases",
        icon: ShoppingCartIcon,
        roles: ["Admin", "Logistics Officer"],
      },
      {
        to: "/transfers",
        name: "Transfers",
        icon: TruckIcon,
        roles: ["Admin", "Logistics Officer"],
      },
      {
        to: "/assignments",
        name: "Assignments",
        icon: ClipboardDocumentCheckIcon,
        roles: ["Admin", "Base Commander"],
      },
      {
        to: "/manage-bases",
        name: "Manage Bases",
        icon: HomeModernIcon,
        roles: ["Admin"],
      },
      {
        to: "/manage-assets",
        name: "Manage Assets",
        icon: CubeIcon,
        roles: ["Admin"],
      },
    ];
    return allLinks.filter((link) => link.roles.includes(role));
  };

  const navLinks = user ? getNavLinks(user.role) : [];

  return (
    <>
      {/* This is the main sidebar container.
        - On mobile (default): 'fixed', 'inset-y-0', 'z-50', hidden with '-translate-x-full'
        - On mobile (when open): 'translate-x-0'
        - On desktop (md:): 'relative', 'translate-x-0'
      */}
      <div
        className={`flex flex-col h-screen w-64 bg-brand-dark bg-topography-pattern text-white transition-transform duration-300 ease-in-out
                    fixed inset-y-0 left-0 z-50 md:relative md:translate-x-0
                    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Header w/ Close button (Mobile) */}
        <div className="flex items-center justify-between h-20 px-4 border-b border-green-600">
          <h1 className="text-2xl font-bold">MAMS</h1>
          <button
            onClick={closeSidebar}
            className="md:hidden p-2 text-gray-300 hover:text-white"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navLinks.map((link) => (
            <NavItem
              key={link.name}
              to={link.to}
              icon={link.icon}
              name={link.name}
              closeSidebar={closeSidebar}
            />
          ))}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center mb-3">
            <div className="p-2 bg-brand-primary rounded-full">
              <UserIcon className="w-6 h-6 text-white" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-gray-400">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-left text-gray-300 rounded-lg hover:bg-red-600 hover:text-white transition-all duration-200"
          >
            <ArrowRightOnRectangleIcon className="w-6 h-6 mr-3" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* This is the backdrop overlay.
        - It only shows on mobile (md:hidden) when the sidebar is open.
        - Clicking it closes the sidebar.
      */}
      {isSidebarOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
        ></div>
      )}
    </>
  );
};

export default Sidebar;

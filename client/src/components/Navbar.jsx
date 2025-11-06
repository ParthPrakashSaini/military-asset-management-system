// /client/src/components/Navbar.jsx

import React from "react";
import { useLocation } from "react-router-dom";
import { Bars3Icon } from "@heroicons/react/24/outline";

const Navbar = ({ setIsSidebarOpen }) => {
  const location = useLocation();

  // A simple function to get a clean page title from the pathname
  const getPageTitle = (pathname) => {
    if (pathname === "/") return "Dashboard";
    // Capitalize the first letter and remove the slash
    return pathname.substring(1).charAt(0).toUpperCase() + pathname.slice(2);
  };

  const title = getPageTitle(location.pathname);

  return (
    <nav className="flex items-center justify-between h-20 px-4 md:px-8 bg-white shadow-md">
      <div className="flex items-center">
        {/* --- Hamburger Button (Mobile Only) --- */}
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="md:hidden p-2 mr-2 text-brand-dark hover:bg-gray-100 rounded-md"
        >
          <Bars3Icon className="w-6 h-6" />
        </button>
        {/* --- End Hamburger --- */}

        <h1 className="text-xl md:text-2xl font-bold text-brand-dark">
          {title}
        </h1>
      </div>

      <div className="flex items-center space-x-4">
        <p className="hidden sm:block text-sm font-medium text-brand-secondary">
          Welcome, Commander.
        </p>
      </div>
    </nav>
  );
};

export default Navbar;

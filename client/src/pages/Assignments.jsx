// /client/src/pages/Assignments.jsx

import React, { useState, useEffect } from "react";
import api from "../services/api";
import AssetTable from "../components/AssetTable";
import AssignmentForm from "../components/AssignmentForm"; // <-- Import the form
import { PlusIcon } from "@heroicons/react/24/outline";
import { useAuthStore } from "../store/authStore";

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // New state for the modal and form data
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bases, setBases] = useState([]);
  const [assets, setAssets] = useState([]);

  // Get user role to conditionally show the button
  const userRole = useAuthStore((state) => state.user?.role);

  // Function to fetch all data
  const fetchAssignments = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/assignments");
      setAssignments(response.data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch assignments:", err);
      setError("Failed to load assignment data.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch dropdown data (bases and assets)
  const fetchDropdownData = async () => {
    try {
      const [basesRes, assetsRes] = await Promise.all([
        api.get("/bases"),
        api.get("/assets"),
      ]);
      setBases(basesRes.data);
      setAssets(assetsRes.data);
    } catch (err) {
      console.error("Failed to fetch dropdown data:", err);
      setError("Failed to load form data. Please refresh.");
    }
  };

  // Fetch all data on component mount
  useEffect(() => {
    fetchAssignments();
    // Only fetch dropdown data if user can create assignments
    if (userRole === "Admin" || userRole === "Base Commander") {
      fetchDropdownData();
    }
  }, [userRole]);

  // This function is passed to the form
  const handleAssignmentSuccess = () => {
    setIsModalOpen(false); // Close the modal
    fetchAssignments(); // Refresh the table
  };

  // --- Table Column Definitions ---
  const columns = [
    {
      Header: "Asset",
      accessor: "Asset",
      Cell: (row) => (
        <div>
          <div className="font-medium text-brand-dark">{row.Asset.name}</div>
          <div className="text-xs text-gray-500">{row.Asset.unit}</div>
        </div>
      ),
    },
    {
      Header: "Status",
      accessor: "expended",
      Cell: (row) =>
        row.expended ? (
          <span className="px-2 py-1 text-xs font-medium text-red-800 bg-red-100 rounded-full">
            Expended
          </span>
        ) : (
          <span className="px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">
            Assigned
          </span>
        ),
    },
    {
      Header: "Quantity",
      accessor: "quantity",
      Cell: (row) => (
        <span className="font-bold text-red-600">
          -{row.quantity.toLocaleString()}
        </span>
      ),
    },
    {
      Header: "Assigned To",
      accessor: "personnel_name",
    },
    {
      Header: "Base",
      accessor: "Base",
      Cell: (row) => row.Base.name,
    },
    {
      Header: "Date",
      accessor: "date",
      Cell: (row) => new Date(row.date).toLocaleDateString(),
    },
    {
      Header: "Recorded By",
      accessor: "User",
      Cell: (row) => row.User.name,
    },
  ];

  // Only show the 'New Record' button to authorized roles
  const canCreate = userRole === "Admin" || userRole === "Base Commander";

  return (
    <>
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-brand-dark">
          Assignments & Expenditures
        </h1>
        {canCreate && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-brand-primary rounded-md shadow-sm hover:bg-brand-dark focus:outline-none"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            New Record
          </button>
        )}
      </div>

      {/* Reusable Table */}
      <AssetTable
        columns={columns}
        data={assignments}
        isLoading={isLoading}
        error={error}
      />

      {/* The Modal (conditionally rendered) */}
      {isModalOpen && (
        <AssignmentForm
          bases={bases}
          assets={assets}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleAssignmentSuccess}
        />
      )}
    </>
  );
};

export default Assignments;

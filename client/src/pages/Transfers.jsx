// /client/src/pages/Transfers.jsx

import React, { useState, useEffect } from "react";
import api from "../services/api";
import AssetTable from "../components/AssetTable";
import TransferForm from "../components/TransferForm"; // <-- Import the form
import { PlusIcon } from "@heroicons/react/24/outline";
import { useAuthStore } from "../store/authStore";

const Transfers = () => {
  const [transfers, setTransfers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // New state for the modal and form data
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bases, setBases] = useState([]);
  const [assets, setAssets] = useState([]);

  // Get user role to conditionally show the button
  const userRole = useAuthStore((state) => state.user?.role);

  // Function to fetch all data
  const fetchTransfers = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/transfers");
      setTransfers(response.data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch transfers:", err);
      setError("Failed to load transfer data.");
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
    fetchTransfers();
    // Only fetch dropdown data if user can create transfers
    if (userRole === "Admin" || userRole === "Logistics Officer") {
      fetchDropdownData();
    }
  }, [userRole]);

  // This function is passed to the form
  const handleTransferSuccess = () => {
    setIsModalOpen(false); // Close the modal
    fetchTransfers(); // Refresh the table
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
      Header: "Quantity",
      accessor: "quantity",
      Cell: (row) => row.quantity.toLocaleString(),
    },
    {
      Header: "From (Source)",
      accessor: "SourceBase",
      Cell: (row) => row.SourceBase.name,
    },
    {
      Header: "To (Destination)",
      accessor: "DestinationBase",
      Cell: (row) => row.DestinationBase.name,
    },
    {
      Header: "Date",
      accessor: "timestamp",
      Cell: (row) => new Date(row.timestamp).toLocaleDateString(),
    },
    {
      Header: "Authorized By",
      accessor: "User",
      Cell: (row) => row.User.name,
    },
  ];

  // Only show the 'New Transfer' button to authorized roles
  const canCreate = userRole === "Admin" || userRole === "Logistics Officer";

  return (
    <>
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-brand-dark">Transfer History</h1>
        {canCreate && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-brand-primary rounded-md shadow-sm hover:bg-brand-dark focus:outline-none"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            New Transfer
          </button>
        )}
      </div>

      {/* Reusable Table */}
      <AssetTable
        columns={columns}
        data={transfers}
        isLoading={isLoading}
        error={error}
      />

      {/* The Modal (conditionally rendered) */}
      {isModalOpen && (
        <TransferForm
          bases={bases}
          assets={assets}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleTransferSuccess}
        />
      )}
    </>
  );
};

export default Transfers;

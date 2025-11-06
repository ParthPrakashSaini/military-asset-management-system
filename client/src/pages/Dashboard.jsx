// /client/src/pages/Dashboard.jsx

import React, { useState, useEffect } from "react";
import api from "../services/api";
import StatCard from "../components/StatCard";
import DetailsModal from "../components/DetailsModal";
import {
  ArrowDownOnSquareIcon,
  ArrowUpOnSquareIcon,
  ArrowsRightLeftIcon,
  ArchiveBoxArrowDownIcon,
} from "@heroicons/react/24/outline";

const Dashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Fetch data as soon as the component loads
    const fetchMetrics = async () => {
      setIsLoading(true);
      try {
        const response = await api.get("/dashboard");
        setMetrics(response.data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch dashboard metrics:", err);
        setError("Failed to load dashboard data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();
  }, []); // Empty dependency array means this runs once on mount

  if (isLoading) {
    return <div className="text-center p-10">Loading Dashboard...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-600">{error}</div>;
  }

  if (!metrics) {
    return <div className="text-center p-10">No dashboard data found.</div>;
  }

  // Format numbers with commas
  const formatValue = (value) => value?.toLocaleString() ?? "0";

  return (
    <>
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-brand-dark mb-6">
        System Overview
      </h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Opening Balance"
          value={formatValue(metrics.openingBalance)}
          icon={ArrowDownOnSquareIcon}
        />
        <StatCard
          title="Closing Balance"
          value={formatValue(metrics.closingBalance)}
          icon={ArrowUpOnSquareIcon}
        />
        <StatCard
          title="Net Movement"
          value={formatValue(metrics.netMovement)}
          icon={ArrowsRightLeftIcon}
          onClick={() => setIsModalOpen(true)} // This card opens the modal
          className="bg-brand-light hover:bg-gray-200" // Special styling
        />
        <StatCard
          title="Total Expended"
          value={formatValue(metrics.totalExpended)}
          icon={ArchiveBoxArrowDownIcon}
        />
      </div>

      {/* Charts and other components will go here */}
      <div className="mt-8">
        <div className="bg-white p-6 rounded-lg shadow-md min-h-[300px]">
          <h2 className="text-xl font-semibold text-brand-dark">
            Asset Allocation
          </h2>
          <p className="mt-4 text-gray-500">
            (Charts and graphs coming soon...)
          </p>
          {/*  */}
        </div>
      </div>

      {/* The Modal */}
      <DetailsModal
        isVisible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={metrics.movementDetails}
      />
    </>
  );
};

export default Dashboard;

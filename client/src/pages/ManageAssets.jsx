// /client/src/pages/ManageAssets.jsx

import React, { useState, useEffect } from "react";
import api from "../services/api";

const ManageAssets = () => {
  const [assets, setAssets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for the new asset form
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    unit: "units",
  });
  const [formError, setFormError] = useState(null);

  const fetchAssets = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/assets");
      setAssets(res.data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch assets:", err);
      setError("Failed to load assets.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    if (!formData.name || !formData.type || !formData.unit) {
      setFormError("All fields are required.");
      return;
    }

    try {
      await api.post("/assets", formData);
      // Reset form and refetch list
      setFormData({ name: "", type: "", unit: "units" });
      fetchAssets();
    } catch (err) {
      console.error("Failed to create asset:", err);
      setFormError(err.response?.data?.message || "Failed to create asset.");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-brand-dark mb-6">
        Manage Asset Types
      </h1>

      {/* 1. Create New Asset Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold text-brand-dark mb-4">
          Create New Asset Type
        </h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Asset Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              placeholder="e.g., Night Vision Goggles"
            />
          </div>
          <div>
            <label
              htmlFor="type"
              className="block text-sm font-medium text-gray-700"
            >
              Asset Type
            </label>
            <input
              type="text"
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              placeholder="e.g., Equipment"
            />
          </div>
          <div>
            <label
              htmlFor="unit"
              className="block text-sm font-medium text-gray-700"
            >
              Unit of Measure
            </label>
            <input
              type="text"
              id="unit"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div className="md:pt-6">
            <button
              type="submit"
              className="w-full flex justify-center px-4 py-2 text-sm font-medium text-white bg-brand-primary rounded-md shadow-sm hover:bg-brand-dark"
            >
              Create Asset
            </button>
          </div>
          {formError && (
            <p className="md:col-span-4 text-sm text-red-600 text-center">
              {formError}
            </p>
          )}
        </form>
      </div>

      {/* 2. List Existing Assets */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-brand-secondary uppercase">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-brand-secondary uppercase">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-brand-secondary uppercase">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-brand-secondary uppercase">
                Unit
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading && (
              <tr>
                <td colSpan="4" className="text-center p-6">
                  Loading...
                </td>
              </tr>
            )}
            {error && (
              <tr>
                <td colSpan="4" className="text-center p-6 text-red-600">
                  {error}
                </td>
              </tr>
            )}
            {assets.map((asset) => (
              <tr key={asset.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-500">
                  {asset.id}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-brand-dark">
                  {asset.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {asset.type}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {asset.unit}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageAssets;

// /client/src/components/PurchaseForm.jsx

import React, { useState } from "react";
import api from "../services/api";
import { XMarkIcon } from "@heroicons/react/24/outline";

const PurchaseForm = ({ bases, assets, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    base_id: "",
    asset_id: "",
    quantity: "",
    date: new Date().toISOString().split("T")[0], // Defaults to today
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Basic validation
    if (!formData.base_id || !formData.asset_id || !formData.quantity) {
      setError("Please fill out all fields.");
      setIsLoading(false);
      return;
    }

    try {
      await api.post("/purchases", {
        ...formData,
        quantity: parseInt(formData.quantity, 10), // Ensure quantity is a number
      });
      setIsLoading(false);
      onSuccess(); // This will trigger a refetch and close the modal
    } catch (err) {
      console.error("Failed to create purchase:", err);
      setError(err.response?.data?.message || "Failed to record purchase.");
      setIsLoading(false);
    }
  };

  return (
    // Modal Backdrop
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-60"
      onClick={onClose}
    >
      {/* Modal Content */}
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6"
        onClick={(e) => e.stopPropagation()} // Prevent closing on content click
      >
        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b">
          <h3 className="text-xl font-semibold text-brand-dark">
            Record New Purchase
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Asset Dropdown */}
          <div>
            <label
              htmlFor="asset_id"
              className="block text-sm font-medium text-gray-700"
            >
              Asset
            </label>
            <select
              id="asset_id"
              name="asset_id"
              value={formData.asset_id}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm"
            >
              <option value="">Select an asset</option>
              {assets.map((asset) => (
                <option key={asset.id} value={asset.id}>
                  {asset.name} ({asset.type})
                </option>
              ))}
            </select>
          </div>

          {/* Base Dropdown */}
          <div>
            <label
              htmlFor="base_id"
              className="block text-sm font-medium text-gray-700"
            >
              Base
            </label>
            <select
              id="base_id"
              name="base_id"
              value={formData.base_id}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm"
            >
              <option value="">Select a base</option>
              {bases.map((base) => (
                <option key={base.id} value={base.id}>
                  {base.name}
                </option>
              ))}
            </select>
          </div>

          {/* Quantity */}
          <div>
            <label
              htmlFor="quantity"
              className="block text-sm font-medium text-gray-700"
            >
              Quantity
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              min="1"
              value={formData.quantity}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm"
            />
          </div>

          {/* Date */}
          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700"
            >
              Date of Purchase
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 text-sm text-center text-red-800 bg-red-100 rounded-md">
              {error}
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-brand-primary border border-transparent rounded-md shadow-sm hover:bg-brand-dark focus:outline-none disabled:bg-gray-400"
            >
              {isLoading ? "Saving..." : "Save Purchase"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PurchaseForm;

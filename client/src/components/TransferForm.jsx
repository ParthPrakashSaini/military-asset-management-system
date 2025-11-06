// /client/src/components/TransferForm.jsx

import React, { useState } from "react";
import api from "../services/api";
import { XMarkIcon } from "@heroicons/react/24/outline";

const TransferForm = ({ bases, assets, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    source_base_id: "",
    dest_base_id: "",
    asset_id: "",
    quantity: "",
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

    // Form validation
    if (
      !formData.source_base_id ||
      !formData.dest_base_id ||
      !formData.asset_id ||
      !formData.quantity
    ) {
      setError("Please fill out all fields.");
      setIsLoading(false);
      return;
    }

    if (formData.source_base_id === formData.dest_base_id) {
      setError("Source and destination bases cannot be the same.");
      setIsLoading(false);
      return;
    }

    try {
      await api.post("/transfers", {
        ...formData,
        quantity: parseInt(formData.quantity, 10),
      });
      setIsLoading(false);
      onSuccess(); // Triggers refetch and closes modal
    } catch (err) {
      console.error("Failed to create transfer:", err);
      setError(err.response?.data?.message || "Failed to record transfer.");
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
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b">
          <h3 className="text-xl font-semibold text-brand-dark">
            Record New Transfer
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

          {/* Source Base Dropdown */}
          <div>
            <label
              htmlFor="source_base_id"
              className="block text-sm font-medium text-gray-700"
            >
              From (Source Base)
            </label>
            <select
              id="source_base_id"
              name="source_base_id"
              value={formData.source_base_id}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm"
            >
              <option value="">Select a source base</option>
              {bases.map((base) => (
                <option key={base.id} value={base.id}>
                  {base.name}
                </option>
              ))}
            </select>
          </div>

          {/* Destination Base Dropdown */}
          <div>
            <label
              htmlFor="dest_base_id"
              className="block text-sm font-medium text-gray-700"
            >
              To (Destination Base)
            </label>
            <select
              id="dest_base_id"
              name="dest_base_id"
              value={formData.dest_base_id}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm"
            >
              <option value="">Select a destination base</option>
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
              {isLoading ? "Saving..." : "Save Transfer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransferForm;

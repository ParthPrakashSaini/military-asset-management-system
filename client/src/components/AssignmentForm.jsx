// /client/src/components/AssignmentForm.jsx

import React, { useState } from "react";
import api from "../services/api";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useAuthStore } from "../store/authStore";

const AssignmentForm = ({ bases, assets, onClose, onSuccess }) => {
  const user = useAuthStore((state) => state.user);

  // If user is a Base Commander, default the form to their base.
  // We'll need to pass the user's base ID to this form later.
  // For now, we'll let them select.
  const [formData, setFormData] = useState({
    base_id: "",
    asset_id: "",
    quantity: "",
    personnel_name: "",
    expended: false, // Default to "Assigned" (not "Expended")
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Form validation
    if (
      !formData.base_id ||
      !formData.asset_id ||
      !formData.quantity ||
      !formData.personnel_name
    ) {
      setError("Please fill out all fields.");
      setIsLoading(false);
      return;
    }

    try {
      await api.post("/assignments", {
        ...formData,
        quantity: parseInt(formData.quantity, 10),
      });
      setIsLoading(false);
      onSuccess(); // Triggers refetch and closes modal
    } catch (err) {
      console.error("Failed to create assignment:", err);
      setError(err.response?.data?.message || "Failed to record assignment.");
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
            Record New Assignment / Expenditure
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
              From Base
            </label>
            <select
              id="base_id"
              name="base_id"
              value={formData.base_id}
              onChange={handleChange}
              // We could disable this for Base Commanders
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

          {/* Personnel Name */}
          <div>
            <label
              htmlFor="personnel_name"
              className="block text-sm font-medium text-gray-700"
            >
              Assigned To (Personnel/Unit)
            </label>
            <input
              type="text"
              id="personnel_name"
              name="personnel_name"
              value={formData.personnel_name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm"
            />
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

          {/* Expended Checkbox */}
          <div className="flex items-center">
            <input
              id="expended"
              name="expended"
              type="checkbox"
              checked={formData.expended}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
            />
            <label
              htmlFor="expended"
              className="ml-3 block text-sm text-gray-700"
            >
              Mark as **Expended** (e.g., ammo, fuel used)
            </label>
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
              {isLoading ? "Saving..." : "Save Record"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignmentForm;

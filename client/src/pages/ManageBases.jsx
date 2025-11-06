// /client/src/pages/ManageBases.jsx

import React, { useState, useEffect } from "react";
import api from "../services/api";

const ManageBases = () => {
  const [bases, setBases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for the new base form
  const [newName, setNewName] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [formError, setFormError] = useState(null);

  const fetchBases = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/bases");
      setBases(res.data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch bases:", err);
      setError("Failed to load bases.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBases();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    if (!newName) {
      setFormError("Base name is required.");
      return;
    }

    try {
      await api.post("/bases", { name: newName, location: newLocation });
      // Reset form and refetch list
      setNewName("");
      setNewLocation("");
      fetchBases();
    } catch (err) {
      console.error("Failed to create base:", err);
      setFormError(err.response?.data?.message || "Failed to create base.");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-brand-dark mb-6">Manage Bases</h1>

      {/* 1. Create New Base Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold text-brand-dark mb-4">
          Create New Base
        </h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div>
            <label
              htmlFor="newName"
              className="block text-sm font-medium text-gray-700"
            >
              Base Name
            </label>
            <input
              type="text"
              id="newName"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm"
              placeholder="e.g., Base Delta"
            />
          </div>
          <div>
            <label
              htmlFor="newLocation"
              className="block text-sm font-medium text-gray-700"
            >
              Location
            </label>
            <input
              type="text"
              id="newLocation"
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm"
              placeholder="e.g., Sector 9"
            />
          </div>
          <div className="md:pt-6">
            <button
              type="submit"
              className="w-full flex justify-center px-4 py-2 text-sm font-medium text-white bg-brand-primary rounded-md shadow-sm hover:bg-brand-dark focus:outline-none"
            >
              Create Base
            </button>
          </div>
          {formError && (
            <p className="md:col-span-3 text-sm text-red-600 text-center">
              {formError}
            </p>
          )}
        </form>
      </div>

      {/* 2. List Existing Bases */}
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
                Location
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading && (
              <tr>
                <td colSpan="3" className="text-center p-6">
                  Loading...
                </td>
              </tr>
            )}
            {error && (
              <tr>
                <td colSpan="3" className="text-center p-6 text-red-600">
                  {error}
                </td>
              </tr>
            )}
            {bases.map((base) => (
              <tr key={base.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-500">
                  {base.id}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-brand-dark">
                  {base.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {base.location}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageBases;

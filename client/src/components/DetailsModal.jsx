// /client/src/components/DetailsModal.jsx

import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

const DetailsModal = ({ isVisible, onClose, data }) => {
  if (!isVisible) return null;

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
      onClick={onClose} // Close modal on backdrop click
    >
      {/* Modal Content */}
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative"
        onClick={(e) => e.stopPropagation()} // Prevent content click from closing modal
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        {/* Header */}
        <h3 className="text-xl font-semibold text-brand-dark mb-4">
          Net Movement Breakdown
        </h3>

        {/* Content */}
        <div className="space-y-3">
          <div className="flex justify-between p-3 bg-green-50 rounded-md">
            <span className="font-medium text-green-700">Total Purchases</span>
            <span className="font-bold text-green-800">
              +{data.purchases?.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between p-3 bg-blue-50 rounded-md">
            <span className="font-medium text-blue-700">Transfers In</span>
            <span className="font-bold text-blue-800">
              +{data.transfersIn?.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between p-3 bg-red-50 rounded-md">
            <span className="font-medium text-red-700">Transfers Out</span>
            <span className="font-bold text-red-800">
              -{data.transfersOut?.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between p-3 bg-yellow-50 rounded-md">
            <span className="font-medium text-yellow-700">
              Expended / Assigned
            </span>
            <span className="font-bold text-yellow-800">
              -{data.expended?.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsModal;

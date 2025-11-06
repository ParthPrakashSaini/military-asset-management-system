// /client/src/components/AssetTable.jsx

import React from "react";

const AssetTable = ({ columns, data, isLoading, error }) => {
  if (isLoading) {
    return <div className="text-center p-6">Loading data...</div>;
  }

  if (error) {
    return <div className="text-center p-6 text-red-600">{error}</div>;
  }

  if (!data || data.length === 0) {
    return <div className="text-center p-6 text-gray-500">No data found.</div>;
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        {/* Table Header */}
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th
                key={col.accessor}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-brand-secondary uppercase tracking-wider"
              >
                {col.Header}
              </th>
            ))}
          </tr>
        </thead>
        {/* Table Body */}
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50 transition-colors">
              {columns.map((col) => (
                <td
                  key={col.accessor}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
                >
                  {/* Use the Cell function if provided, otherwise just show data */}
                  {col.Cell ? col.Cell(row) : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssetTable;

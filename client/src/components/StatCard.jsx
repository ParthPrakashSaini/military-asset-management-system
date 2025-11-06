// /client/src/components/StatCard.jsx

import React from "react";

const StatCard = ({ title, value, icon: Icon, onClick, className = "" }) => {
  const isClickable = !!onClick;

  return (
    <div
      onClick={onClick}
      className={`bg-white p-6 rounded-lg shadow-md flex items-center justify-between ${className} ${
        isClickable
          ? "cursor-pointer hover:shadow-lg transition-shadow duration-200"
          : ""
      }`}
    >
      <div>
        <p className="text-sm font-medium text-brand-secondary uppercase tracking-wider">
          {title}
        </p>
        <p className="text-3xl font-bold text-brand-dark">{value}</p>
      </div>
      {Icon && (
        <div className="p-3 bg-brand-primary rounded-full">
          <Icon className="w-6 h-6 text-white" />
        </div>
      )}
    </div>
  );
};

export default StatCard;

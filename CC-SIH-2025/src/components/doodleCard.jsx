import React from 'react';
import "./DropDown.css"
const DoodleCard = ({ title, children, className = '' }) => {
  return (
    <div className={`doodle-border flex flex-col p-4 bg-white ${className}`}>
      {title && (
        <h3 className="text-gray-800 text-2xl font-bold mb-2">{title}</h3>
      )}
      {children}
    </div>
  );
};

export default DoodleCard;
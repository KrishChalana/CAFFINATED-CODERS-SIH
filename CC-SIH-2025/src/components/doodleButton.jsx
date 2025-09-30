
import "./DropDown.css"
import React from 'react';

const DoodleButton = ({ text, onClick ,className}) => {
  return (
    <button
      onClick={onClick}
      className={`doodle-button flex items-center justify-center h-14 mt-10 mx-2 px-4 bg-blue-500 text-white text-2xl font-bold hover:bg-blue-600 ${className}`}
    >
      {text}
    </button>
  );
};

export default DoodleButton;
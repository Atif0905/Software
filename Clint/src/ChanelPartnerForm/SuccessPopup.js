import React from 'react';
import './Chanel.css'; // Add some styling for popup

const SuccessPopup = ({ show, onClose, message }) => {
  if (!show) return null;

  return (
    <div className="success-popup-overlay">
      <div className="success-popup">
        <p>{message}</p>
        <button onClick={onClose} className="close-btn">Close</button>
      </div>
    </div>
  );
};

export default SuccessPopup;

import React from 'react';

const ConfirmationModal = ({ show, onClose, onConfirm, message }) => {
  if (!show) return null;

  return (
    <div className="confirm-modal">
      <div className="confirm-modal-content">
        <h3>Confirm</h3>
        <p>{message}</p>
        <button onClick={onConfirm} className='yesbutton'>Yes</button>
        <button onClick={onClose} className='nobutton'>No</button>
      </div>
    </div>
  );
};

export default ConfirmationModal;

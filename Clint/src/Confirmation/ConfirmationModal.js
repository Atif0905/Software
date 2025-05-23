import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const ConfirmationModal = ({ show, onClose, onConfirm, message }) => {
  useEffect(() => {
    AOS.init({ duration: 500 });
  }, []);

  if (!show) return null;

  return (
    <div className='confirm'>
    <div className="confirm-modal">
      <div 
        className="confirm-modal-content" 
        data-aos="zoom-in"
      >
        <h5 className='mt-1'>Are You Sure?</h5>
        <p>{message}</p>
        <button onClick={onConfirm} className='yesbutton'>Accept</button>
        <button onClick={onClose} className='nobutton'>Go Back</button>
      </div>
    </div>
    </div>
  );
};

export default ConfirmationModal;
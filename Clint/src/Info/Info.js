import React, { useState } from 'react';
import MailContentPage from '../MailData/MailContentPage';
import UpdateLogoPage from '../Sidebar/UpdateLogoPage';
import "./Info.css"
const Info = () => {
  const [isMailModalOpen, setIsMailModalOpen] = useState(false);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);

  const handleDownload = (csvUrl) => {
    const link = document.createElement('a');
    link.href = csvUrl;
    link.download = csvUrl.split('/').pop();
    link.click();
  };

  return (
    <div className="main-content">
      <div className='formback'>
        <h2 className='formhead'>Download CSV Files</h2>
        <button className='buttonDownload' onClick={() => handleDownload('/Project.csv')} style={buttonStyle}>
          Download Project CSV
        </button>
        <button className='buttonDownload' onClick={() => handleDownload('/unit1.csv')} style={buttonStyle}>
          Download Unit CSV
        </button>
        <button className='buttonDownload' onClick={() => handleDownload('/Block1.csv')} style={buttonStyle}>
          Download Block CSV
        </button>
      </div>
      <div className='formback'>
        <h2 className='formhead mt-3'>Update Details</h2>
        <button onClick={() => setIsMailModalOpen(true)} style={buttonStyle}>
           Mail Content
        </button>
        <button onClick={() => setIsLogoModalOpen(true)} style={buttonStyle}>
           Update Logo
        </button>
      </div>
      {isMailModalOpen && (
        <div className="info-modal">
          <div className="info-modal-content">
            <span className="info-close" onClick={() => setIsMailModalOpen(false)}>
              &times;
            </span>
            <MailContentPage />
          </div>
        </div>
      )}
      {isLogoModalOpen && (
        <div className="info-modal">
          <div className="info-modal-content">
            <span className="info-close" onClick={() => setIsLogoModalOpen(false)}>
              &times;
            </span>
            <UpdateLogoPage />
          </div>
        </div>
      )}
    </div>
  );
};
const buttonStyle = {
  margin: '10px',
  padding: '10px 20px',
  fontSize: '16px',
};
export default Info;
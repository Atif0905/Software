import React from 'react'

const Info = () => {
    const handleDownload = (pdfUrl) => {
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = pdfUrl.split('/').pop(); // Set the filename based on the URL
        link.click();
      };
  return (
    <div className='main-content'>
         <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h2>Download PDF Files</h2>
      
      <button onClick={() => handleDownload('/Project.csv')} style={buttonStyle}>
        Download Project csv
      </button>
      
      <button onClick={() => handleDownload('/unit1.csv')} style={buttonStyle}>
        Download unit csv
      </button>
      
      <button onClick={() => handleDownload('/Block1.csv')} style={buttonStyle}>
        Download Block csv
        </button>
    </div>
    </div>
  )
}
const buttonStyle = {
    margin: '10px',
    padding: '10px 20px',
    fontSize: '16px',
  };
export default Info
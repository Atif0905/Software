import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UpdateLogoPage = () => {
  const [currentLogo, setCurrentLogo] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/logo`);
        setCurrentLogo(response.data.files[0]);
        console.log(response.data.files[0])
      } catch (error) {
        console.error('Error fetching logo:', error);
      }
    };

    fetchLogo();
  }, []);
  const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      setMessage('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('files', selectedFile);

    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/logo`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setCurrentLogo(response.data.files[0]);
      setMessage('Logo updated successfully!');
    } catch (error) {
      console.error('Error updating logo:', error);
      setMessage('Failed to update logo.');
    }
  };
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Update Logo</h1>
      <div>
        <h3>Current Logo</h3>
        {currentLogo ? (
          <img src={`${process.env.REACT_APP_API_URL}/${currentLogo[0]}`}  className='sidelogo'  alt='Logo'/>
        ) : (
          <p>No logo available.</p>
        )}
      </div>
      <form onSubmit={handleFormSubmit} style={{ marginTop: '20px' }}>
        <label htmlFor="fileUpload" style={{ display: 'block', marginBottom: '10px' }}>
          Upload a new logo:
        </label>
        <input
          type="file"
          id="fileUpload"
          onChange={handleFileChange}
          accept="image/*"
          style={{ marginBottom: '10px' }}
        />
        <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>
          Update Logo
        </button>
      </form>
      {message && <p style={{ marginTop: '20px', color: 'green' }}>{message}</p>}
    </div>
  );
};

export default UpdateLogoPage;

import React, { useState } from 'react';
import axios from 'axios';

const Receivedpayments = () => {
  const [aadharNumber, setAadharNumber] = useState('');
  const [customerDetails, setCustomerDetails] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!aadharNumber) {
      // Aadhar number is empty, do not make the API request
      setError('Please enter a valid Aadhar number');
      return;
    }
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/viewcustomer/${aadharNumber}`);
      setCustomerDetails(response.data);
      setError(null);
    } catch (error) {
      setError('Customer not found');
      setCustomerDetails(null);
    }
  };

  return (
    <div className='main-content'>
      <h4 className='Headtext'>Receive Payment from Customer</h4>
      <form onSubmit={handleSearch}>
        <div className='col-4'>
          <div className='whiteback'>
            <label className='mt-3'>Customer Aadhar Number</label>
            <input
              className='form-input-field'
              type='text'
              placeholder='Enter Customer Aadhar Number'
              value={aadharNumber}
              onChange={(e) => setAadharNumber(e.target.value)}
            />
            <button className='add-buttons mt-3' type='submit'>Search</button>
          </div>
        </div>
      </form>

      {error && <p>{error}</p>}
      
      {customerDetails && (
        <div>
          <h2>Customer Details</h2>
          <p>Name: {customerDetails.name}</p>
          <p>Father/Husband Name: {customerDetails.fatherOrHusbandName}</p>
          <p>Address: {customerDetails.address}</p>
          <p>Aadhar Number: {customerDetails.aadharNumber}</p>
          <p>PAN Number: {customerDetails.panNumber}</p>
          <p>Mobile Number: {customerDetails.mobileNumber}</p>
          <a href='/Deposit' >  Make Payment</a>
        </div>
      )}
    </div>
  );
};

export default Receivedpayments;

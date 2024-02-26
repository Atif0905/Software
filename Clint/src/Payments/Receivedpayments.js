import React, { useState } from 'react';
import axios from 'axios';
import './Payments.css'



const Receivedpayments = () => {
  const [aadharNumber, setAadharNumber] = useState('');
  const [customerDetails, setCustomerDetails] = useState(null);
  const [error, setError] = useState(null);
  const [yourAadharNumber, setYourAadharNumber] = useState('');

  const [payment, setPayment] = useState({
    paymentType: '',
    paymentMode: '',
    amount: '',
    reference: '',
    comment: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayment({ ...payment, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate Aadhar number
      if (aadharNumber !== yourAadharNumber) {
        setError('Entered Aadhar number does not match the searched Aadhar number');
        return;
      }
  
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/paymentDetails`, {
        paymentType: payment.paymentType,
        paymentMode: payment.paymentMode,
        amount: payment.amount,
        reference: payment.reference,
        comment: payment.comment,
        aadharNumber: yourAadharNumber
      });
      console.log(response.data); // Log the response from the server
      // Optionally, reset the form after successful submission
      setPayment({
        paymentType: '',
        paymentMode: '',
        amount: '',
        reference: '',
        comment: ''
      });
      // Clear error if any
      setError(null);
    } catch (error) {
      console.error('Error submitting payment:', error);
      setError('Error submitting payment');
    }
  };
  

  const [showPaymentForm, setShowPaymentForm] = useState(false);

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

  const handleMakePayment = () => {
    setShowPaymentForm(true);
  }; return (
    <div className='main-content'>
      <h4 className='Headtext'>Receive Payment from Customer</h4>
      <div className='d-flex'>
        <form onSubmit={handleSearch}>
          <div className='col-8'>
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
          <div className='col-8 whiteback'>
            <div className="table-wrapper">
              <table className="fl-table d-flex">
                <thead>
                  <tr><th>Name</th></tr>
                  <tr><th>Father/Husband Name</th></tr>
                  <tr><th>Address</th></tr>
                  <tr><th>Aadhar Number</th></tr>
                  <tr><th>Pan Number</th></tr>
                  <tr><th>Mobile Number</th></tr>
                </thead>
                <tbody>
                  <tr><td>{customerDetails.name}</td></tr>
                  <tr><td>{customerDetails.fatherOrHusbandName}</td></tr>
                  <tr><td>{customerDetails.address}</td></tr>
                  <tr><td>{customerDetails.aadharNumber}</td></tr>
                  <tr><td>{customerDetails.panNumber}</td></tr>
                  <tr><td>{customerDetails.mobileNumber}</td></tr>
                </tbody>
              </table>
            </div>
            <h4 className='Headtext1' onClick={handleMakePayment}>Make Payment</h4>
          </div>
        )}
      </div>

      {showPaymentForm && (
        <div>
          <h4 className='Headtext'>Post Payment of customers</h4>
          <h4 className='Headtext1'>Name: {customerDetails.name}, Aadhar Number: {customerDetails.aadharNumber}</h4>
          <div className='d-flex justify-content-between'>
            <div className='col-3 whiteback mt-4'>
              <form onSubmit={handleSubmit}>
                <label>Select Payment</label>
                <select className='select-buttons ps-1' name='paymentType' value={payment.paymentType} onChange={handleChange}>
                  <option>Select</option>
                  <option>Second Installment</option>
                </select>
                <label>Select Payment Mode</label>
                <select className='select-buttons ps-1' name='paymentMode' value={payment.paymentMode} onChange={handleChange}>
                  <option>Select</option>
                  <option>cheque</option>
                  <option>cash</option>
                  <option>Bank Deposit</option>
                  <option>Bank Transfer</option>
                  <option>Online</option>
                  <option>commision Adjustment</option>
                </select>
                <label>Amount</label>
                <input type='number' className='form-input-field' name='amount' value={payment.amount} onChange={handleChange} />
                <label>Cheque/ Receipt/ No.</label>
                <input type='text' className='form-input-field' name='reference' value={payment.reference} onChange={handleChange} />
                <label>Aadhar Number</label>
                <input required
                  className='form-input-field'
                  type='text'
                  placeholder='Enter Your Aadhar Number'
                  value={yourAadharNumber}
                  onChange={(e) => setYourAadharNumber(e.target.value)}
                />

                <label>Comment</label>
                <input type='text' className='form-input-field' name='comment' placeholder='Enter comment regarding payment' value={payment.comment} onChange={handleChange} />
                <button type='submit' className='btn btn-primary mt-3'>Submit</button>
              </form>
            </div>
            <div className='col-8 mt-4'>
              <div className='whiteback'>
                <h2 className='head'>Total Due Till date : {customerDetails.totalprice}</h2>
                <h4 className='Headtext1'>Payment Plan Details</h4>
                <table>
                  <thead>
                    <tr>
                      <th>Installment</th>
                      <th>Due Date</th>
                      <th>Installment Amount</th>
                      <th>Paid Amount</th>
                      <th>Balance amount</th>
                      <th>Penalty</th>
                      <th>Wave OFF Amount</th>
                      <th>Wave OFF remark</th>
                      <th>Wave OFF</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td>{customerDetails.paymentReceived}</td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>

  );
};

export default Receivedpayments;

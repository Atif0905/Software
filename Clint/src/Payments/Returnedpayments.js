import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ConfirmationModal from '../Confirmation/ConfirmationModal';

const Returnedpayments = () => {
  const [customername, setCustomername] = useState([]);
  const [customeremail, setCustomeremail] = useState([]);
  const [projectname, setProjectname] = useState('');
  const [blockname, setBlockname] = useState('');
  const [unitname, setUnitname] = useState('');
  const [paymentMode, setPaymentMode] = useState('');
  const [reference, setReference] = useState('');
  const [amount, setAmount] = useState('');
  const [comment, setComment] = useState('');
  const [PaymentDate, setPaymentDate] = useState('');
  const [showConfirm, setShowConfirm] = useState(false); 

  const handleSubmit = async () => {
    const ReturnpaymentData = {
      customername,
      customeremail,
      projectname,
      unitname,
      blockname,
      paymentMode,
      reference,
      amount,
      comment,
      PaymentDate,
    };

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/Return-Payment`, ReturnpaymentData);
      setCustomername('');
      setCustomeremail('');
      setProjectname('');
      setBlockname('');
      setUnitname('');
      setPaymentMode('');
      setReference('');
      setAmount('');
      setComment('');
      setPaymentDate('');
      const sendEmailResponse = await axios.post(`${process.env.REACT_APP_API_URL}/send-return-email`, ReturnpaymentData);

            if (sendEmailResponse.status === 200) {
            } else {
              console.error('Failed to send email:', sendEmailResponse.statusText);
              console.log(sendEmailResponse)
            }
    } catch (error) {
      console.error('Error submitting Payments:', error);
    }
  };

  const handleSubmit1 = (e) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  return (
    <div className='main-content'>
          <div className='formback'>
          <h2 className="formhead">Return Payments</h2>
            <form onSubmit={handleSubmit1} className='p-3'>
            
            <div>
                <label htmlFor="customername" className='mt-3'>Customer Name:</label>
                <input type='text' id="customername" className="form-input-field" value={customername} onChange={(e) => setCustomername(e.target.value)} />
              </div>
              <div>
                <label htmlFor="customeremail" className='mt-3'>Customer Email:</label>
                <input type='email' id="customeremail" className="form-input-field" value={customeremail} onChange={(e) => setCustomeremail(e.target.value)} />
              </div>
              <div>
                <label htmlFor="projectname" className='mt-3'>Project Name:</label>
                <input type='text' id="projectname" className="form-input-field" value={projectname} onChange={(e) => setProjectname(e.target.value)} />
              </div>
              <div>
                <label htmlFor="blockname" className='mt-3'>Block Name:</label>
                <input type='text' id="blockname" className="form-input-field" value={blockname} onChange={(e) => setBlockname(e.target.value)} />
              </div>
              <div>
                <label htmlFor="unitname" className='mt-3'>Unit Name:</label>
                <input type='text' id="unitname" className="form-input-field" value={unitname} onChange={(e) => setUnitname(e.target.value)} />
              </div>
              
              <div>
                <label htmlFor="paymentMode" className='mt-3'>Payment Mode:</label>
                <input type='text' id="paymentMode" className="form-input-field" value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)} />
              </div>
              <div>
                <label htmlFor="reference" className='mt-3'>Reference:</label>
                <input type='text' id="reference" className="form-input-field" value={reference} onChange={(e) => setReference(e.target.value)} />
              </div>
              <div>
                <label htmlFor="amount" className='mt-3'>Amount:</label>
                <input type='text' id="amount" className="form-input-field" value={amount} onChange={(e) => setAmount(e.target.value)} />
              </div>
              <div>
                <label htmlFor="comment" className='mt-3'>Comment:</label>
                <input type='text' id="comment" className="form-input-field" value={comment} onChange={(e) => setComment(e.target.value)} />
              </div>
              <div>
                <label htmlFor="PaymentDate" className='mt-3'>Payment Date:</label>
                <input type='date' id="PaymentDate" className="form-input-field" value={PaymentDate} onChange={(e) => setPaymentDate(e.target.value)} />
              </div>
              <button className='addbutton mt-3' type="submit">Submit</button>
              <ConfirmationModal show={showConfirm} onClose={() => setShowConfirm(false)} onConfirm={() => {  setShowConfirm(false);  handleSubmit(); }} message="Are you sure you want to Submit this Payment" />
            </form>
          </div>
        </div>
  );
};

export default Returnedpayments;

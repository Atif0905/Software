import React, { useState } from 'react';
import axios from 'axios';
import './Plan.css';
import ConfirmationModal from '../Confirmation/ConfirmationModal';
const AddPlan = () => {
  const [selectedOption, setSelectedOption] = useState('');
  const [planName, setPlanName] = useState('');
  const [numInstallments, setNumInstallments] = useState('');
  const [installments, setInstallments] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [errorModal, setErrorModal] = useState(false);
  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };
  const handlePlanNameChange = (event) => {
    setPlanName(event.target.value);
  };
  const handleNumInstallmentsChange = (event) => {
    const num = parseInt(event.target.value);
    setNumInstallments(num);
    const updatedInstallments = Array.from({ length: num }, (_, index) => ({
      daysFromBooking: '', 
      amountRS: '', 
    }));
    setInstallments(updatedInstallments);
  };
  const handleInstallmentChange = (index, key, value) => {
    const updatedInstallments = [...installments];
    updatedInstallments[index][key] = value;
    updatedInstallments[index].installment = index + 1;
    setInstallments(updatedInstallments);
  };
  const handleRemoveInstallment = (index) => {
    const updatedInstallments = [...installments];
    updatedInstallments.splice(index, 1);
    setInstallments(updatedInstallments);
  };
  const handleSubmit = (event) => {
    const validInstallments = installments.every(installment => installment.amountRS && installment.daysFromBooking );
    if (!validInstallments) {
      console.error('Error: All installments must have amountRS and daysFromBooking');
      return;
    }
    axios.post(`${process.env.REACT_APP_API_URL}/PaymentPlans`, {
      type: selectedOption,
      planName: planName,
      numInstallments: numInstallments,
      installments: installments,
    })
      .then((response) => {
        setSelectedOption('');
        setPlanName('');
        setNumInstallments('');
        setInstallments([]);
        setShowModal(true);
      })
      .catch((error) => {
        console.error('Error:', error);
        setErrorMessage(error.text || "An unexpected error occurred.");
        setErrorModal(true);
      });
  };
  const handleSubmit1 = (e) => {
    e.preventDefault();
    setShowConfirm(true);
  };
  const closeModal = () => {
    setShowModal(false);
  };

  const closeErrorModal = () => {
    setErrorModal(false);
  };
  return (
    <div className='main-content'>
      <div className='row'>
      <div className='col-3'></div>
      <div className='col-5'>
        <div className='formback'>
        <h4 className='formhead'>Add a New Payment Plan</h4>
        <div className='p-3'>
          <form onSubmit={handleSubmit1}>
            <label>Choose an option:</label>
            <select className="select-buttons ps-1" value={selectedOption} onChange={handleSelectChange}>
              <option value="">Select an option</option>
              <option value="percentage">Percentage</option>
            </select>
            <div className='mt-2'>
              <label>Plan Name</label>
              <input type="text" className="form-input-field" placeholder="Enter Plan Name" value={planName} onChange={handlePlanNameChange} required />
            </div>
            <div className='mt-2'>
              <label>No of Installments</label>
              <input type="number" className="form-input-field" placeholder="Enter No of Installments" value={numInstallments} onChange={handleNumInstallmentsChange} required />
            </div>
            <div className='mt-2'>
              {installments.map((installment, index) => (
                <div key={index} className='installment '>
                  <input type="number" className='form-input-field ' placeholder="Days from Booking" value={installment.daysFromBooking} onChange={(e) => handleInstallmentChange(index, 'daysFromBooking', e.target.value)} />
                  <input type="number" className='form-input-field mt-1' placeholder="Amount (RS)" value={installment.amountRS} onChange={(e) => handleInstallmentChange(index, 'amountRS', e.target.value)} />
                  <button type="button" className="btn btn-primary mt-1 mb-2" onClick={() => handleRemoveInstallment(index)}>Remove</button>
                </div>
              ))}
            </div>
            <div className='center'><button type="submit" className="addbutton mt-3">SUBMIT</button></div>
            <ConfirmationModal
            show={showConfirm}
            onClose={() => setShowConfirm(false)}
            onConfirm={() => {
              setShowConfirm(false);
              handleSubmit();
            }}
            message="Are you sure you want to add this payment plan?"/>
          </form>
        </div>
      </div>
    </div>
    </div>
    {showModal && (
        <div className="homemodal">
          <div className="homemodal-content">
            <p>Payment Plan Uploaded Successfully</p>
            <button onClick={closeModal}>Ok</button>
          </div>
        </div>
      )}
      {errorModal && (
        <div className="homemodal">
          <div className="homemodal-content">
            <p>{errorMessage}</p>
            <button onClick={closeErrorModal}>Ok</button>
          </div>
        </div>
      )}
    </div>
  );
};
export default AddPlan;
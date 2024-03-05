import React, { useState } from 'react';
import axios from 'axios';
import './Plan.css';
const AddPlan = () => {
  const [selectedOption, setSelectedOption] = useState('');
  const [planName, setPlanName] = useState('');
  const [numInstallments, setNumInstallments] = useState('');
  const [installments, setInstallments] = useState([]);
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
  const handleAddInstallment = () => {
    setInstallments([...installments, { daysFromBooking: '', amountRS: '' }]);
  };
  const handleRemoveInstallment = (index) => {
    const updatedInstallments = [...installments];
    updatedInstallments.splice(index, 1);
    setInstallments(updatedInstallments);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const validInstallments = installments.every(installment => installment.amountRS && installment.daysFromBooking );
    if (!validInstallments) {
      console.error('Error: All installments must have amountRS and daysFromBooking');
      return;
    }
    axios.post(`${process.env.REACT_APP_API_URL}/createPaymentPlan`, {
      type: selectedOption,
      planName: planName,
      numInstallments: numInstallments,
      installments: installments,
    })
      .then((response) => {
        console.log('Success:', response.data);
        setSelectedOption('');
        setPlanName('');
        setNumInstallments('');
        setInstallments([]);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };
  return (
    <div className='main-content'>
      <div className='col-5'>
        <h4 className='Headtext'>Add a New Payment Plan</h4>
        <div className='whiteback'>
          <form onSubmit={handleSubmit}>
            <label>Choose an option:</label>
            <select className="select-buttons ps-1" value={selectedOption} onChange={handleSelectChange}>
              <option value="">Select an option</option>
              <option value="percentage">Percentage</option>
              <option value="amount">Amount</option>
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
              {/* <label>Installments</label> */}
              {installments.map((installment, index) => (
                <div key={index} className='installment '>
                  <input type="number" className='form-input-field ' placeholder="Days from Booking" value={installment.daysFromBooking} onChange={(e) => handleInstallmentChange(index, 'daysFromBooking', e.target.value)} />
                  <input type="number" className='form-input-field mt-1' placeholder="Amount (RS)" value={installment.amountRS} onChange={(e) => handleInstallmentChange(index, 'amountRS', e.target.value)} />
                  <button type="button" className="btn btn-primary mt-1 mb-2" onClick={() => handleRemoveInstallment(index)}>Remove</button>
                </div>
              ))}
            </div>
            <button type="submit" className="btn btn-primary mt-3">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPlan;

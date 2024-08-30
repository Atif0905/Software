import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ConfirmationModal from '../Confirmation/ConfirmationModal';

const ExpenseForm = () => {
  const [teamLeadNames, setTeamLeadNames] = useState([]);
  const [teamLeadName, setTeamLeadName] = useState('');
  const [expenseSummary, setExpenseSummary] = useState('');
  const [amount, setAmount] = useState('');
  const [comment, setComment] = useState('');
  const [Paydate, setPaydate] = useState('');
  const [showConfirm, setShowConfirm] = useState(false); 

  useEffect(() => {
    const fetchTeamLeadNames = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/Viewcustomer`);
        const teamLeadNamesData = response.data.map(customer => customer.Teamleadname);
        const uniqueTeamLeadNames = [...new Set(teamLeadNamesData)];
        setTeamLeadNames(uniqueTeamLeadNames);
      } catch (error) {
        console.error('Error fetching team lead names:', error);
      }
    };

    fetchTeamLeadNames();
  }, []);

  const handleSubmit = async () => {
    const expenseData = {
      teamLeadName,
      expenseSummary,
      amount,
      comment,
      Paydate,
    };

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/expenses`, expenseData);
      console.log('Expense submitted:', response.data);
      setTeamLeadName('');
      setExpenseSummary('');
      setAmount('');
      setComment('');
      setPaydate('');
    } catch (error) {
      console.error('Error submitting expense:', error);
    }
  };

  const handleSubmit1 = (e) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  return (
    <div className='main-content'>
      <h2 className="Headtext">Expense Form</h2>
      <div className='row'>
        <div className='col-6'>
          <div className='whiteback'>
            <form onSubmit={handleSubmit1}>
              <div>
                <label htmlFor="teamLeadName" className='mt-3'>Team Lead Name:</label>
                <select id="teamLeadName" className="form-input-field" value={teamLeadName} onChange={(e) => setTeamLeadName(e.target.value)} required>
                  <option value="">Select Team Lead</option>
                  {teamLeadNames.map((name, index) => (
                    <option key={index} value={name}>{name.toUpperCase()}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="expenseSummary" className='mt-3'>Expense Summary:</label>
                <select id="expenseSummary" className="form-input-field" value={expenseSummary} onChange={(e) => setExpenseSummary(e.target.value)} required >
                  <option value="">Select Option</option>
                  <option value="Salary">Salary</option>
                  <option value="Sitting">Sitting</option>
                  <option value="Site Visit">Site Visit</option>
                  <option value="Others">Others</option>
                </select>
              </div>
              <div>
                <label htmlFor="amount" className='mt-3'>Amount:</label>
                <input type="number" id="amount" className="form-input-field" value={amount} onChange={(e) => setAmount(e.target.value)} required />
              </div>
              <div>
                <label htmlFor="Paydate" className='mt-3'>Payment date:</label>
                <input type="date" id="Paydate" className="form-input-field" value={Paydate} onChange={(e) => setPaydate(e.target.value)} required />
              </div>
              <div>
                <label htmlFor="comment" className='mt-3'>Comment:</label>
                <input type='text' id="comment" className="form-input-field" value={comment} onChange={(e) => setComment(e.target.value)} />
              </div>
              <button className='btn btn-primary mt-3' type="submit">Submit</button>
              <ConfirmationModal show={showConfirm} onClose={() => setShowConfirm(false)} onConfirm={() => {  setShowConfirm(false);  handleSubmit(); }} message="Are you sure you want to Submit this Expense" />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseForm;

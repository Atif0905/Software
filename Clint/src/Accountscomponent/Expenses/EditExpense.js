import React, { useState, useEffect } from 'react';
import axios from 'axios';
const ExpenseEdit = () => {
  const [expense, setExpense] = useState(null);
  const [teamLeadName, setTeamLeadName] = useState('');
  const [expenseSummary, setExpenseSummary] = useState('');
  const [amount, setAmount] = useState('');
  const [comment, setComment] = useState('');
  const [Paydate, setPaydate] = useState('');
  const [error, setError] = useState(null);
  useEffect(() => {
    const expenseData = JSON.parse(localStorage.getItem('editExpense'));
    if (expenseData) {
      setExpense(expenseData);
      setTeamLeadName(expenseData.teamLeadName);
      setExpenseSummary(expenseData.expenseSummary);
      setAmount(expenseData.amount);
      setComment(expenseData.comment);
      setPaydate(expenseData.Paydate);
    } else {
      setError('No expense data available');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/expenses/${expense._id}`, {
        teamLeadName,
        expenseSummary,
        amount,
        comment,
        Paydate
      });
      alert('Expense updated successfully');
      localStorage.removeItem('editExpense'); // Clear data after update
    } catch (error) {
      console.error('Failed to update expense:', error);
      alert('Failed to update expense');
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className='main-content'>
      
      <form onSubmit={handleSubmit}>
        <div className='row'>
        <div className='col-2'></div>
        <div className='col-7'>
        <div className='formback'>
        <h2 className='formhead'>Edit Expense</h2>
          <div className='p-3'>
        <div>
          <label>Team Lead Name:</label>
          <input type="text" className="form-input-field" value={teamLeadName} onChange={(e) => setTeamLeadName(e.target.value)} required />
        </div>
        <div>
          <label>Expense Summary:</label>
          <input type="text" className="form-input-field" value={expenseSummary} onChange={(e) => setExpenseSummary(e.target.value)} required />
        </div>
        <div>
          <label>Amount:</label>
          <input type="number" className="form-input-field" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        </div>
        <div>
          <label>Comment:</label>
          <input type='text' className="form-input-field"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
        <div>
          <label>Payment Date:</label>
          <input type="date" className="form-input-field" value={Paydate} onChange={(e) => setPaydate(e.target.value)} required
          />
        </div>
        <div className='center'><button className='addbutton mt-3' type="submit">Edit</button></div>
        </div>
        </div>
        </div>
        </div>
      </form>
      
    </div>
  );
};

export default ExpenseEdit;

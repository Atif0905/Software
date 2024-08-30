import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Loader from '../Confirmation/Loader';

const Expensedetails = () => {
  const [expenses, setExpenses] = useState([]);
  const [uniqueExpenses, setUniqueExpenses] = useState([]);
  const [loading, setLoading] = useState('')
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/expenses`);
        const allExpenses = response.data;
        
        // Process the expenses to get unique team leads
        const uniqueTeamLeads = new Map();

        allExpenses.forEach(expense => {
          if (!uniqueTeamLeads.has(expense.teamLeadName)) {
            uniqueTeamLeads.set(expense.teamLeadName, {
              teamLeadName: expense.teamLeadName,
              expenseSummary: expense.expenseSummary,
              amount: 0, // Initialize total amount
              comment: expense.comment,
              id: expense._id
            });
          }
          // Accumulate amounts for the same team lead
          uniqueTeamLeads.get(expense.teamLeadName).amount += expense.amount;
        });

        setUniqueExpenses(Array.from(uniqueTeamLeads.values()));
      } catch (error) {
        console.error('Failed to fetch expenses:', error);
      }
    };
    
    fetchExpenses();
  }, []);
  return (
    <div className='main-content'>
      <div >
        {loading ? (
          <div className="d-flex justify-content-center">
          <Loader />
          </div>
        ) : (
          <div>
      <h2 className='Headtext'>Expense Details</h2>
      <div className='whiteback'>
        <table id='viewcustomertable'>
          <thead>
            <tr>
              <th>Team Lead Name</th> 
              <th>Amount</th>
              <th>See Full Details</th>
            </tr>
          </thead>
          <tbody>
            {uniqueExpenses.map((expense, index) => (
              <tr key={index}>
                <td>{expense.teamLeadName.toUpperCase()}</td>
                <td>{expense.amount}</td>
                <td><Link to={`/TotalExpensePaidByteamLeader/${expense.id}`}>See Full Details</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
      )}
      </div>
    </div>
  );
};

export default Expensedetails;

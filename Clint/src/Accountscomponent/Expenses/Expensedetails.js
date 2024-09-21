import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Loader from '../../Confirmation/Loader';

const Expensedetails = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/expenses`);
        setExpenses(response.data);
      } catch (error) {
        console.error('Failed to fetch expenses:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchExpenses();
  }, []);
  const uniqueExpenses = useMemo(() => {
    const uniqueTeamLeads = new Map();
    expenses.forEach(expense => {
      if (!uniqueTeamLeads.has(expense.teamLeadName)) {
        uniqueTeamLeads.set(expense.teamLeadName, {
          teamLeadName: expense.teamLeadName,
          expenseSummary: expense.expenseSummary,
          amount: 0, 
          comment: expense.comment,
          id: expense._id
        });
      }
      uniqueTeamLeads.get(expense.teamLeadName).amount += expense.amount;
    });
    return Array.from(uniqueTeamLeads.values());
  }, [expenses]);

  return (
    <div className='main-content'>
      <div>
        {loading ? (
          <div className="d-flex justify-content-center">
            <Loader />
          </div>
        ) : (
          <div className='formback'>
            <h2 className='formhead'>Expense Details</h2>
            <div className='p-3'>
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
                    <tr key={expense.id}>
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

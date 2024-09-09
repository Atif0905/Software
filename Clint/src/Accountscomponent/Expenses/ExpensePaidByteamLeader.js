import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from '../../Confirmation/Loader';
import '../Accounts.css';

const ExpensePaidByteamLeader = () => {
  const { _id } = useParams(); 
  const navigate = useNavigate();
  const [expense, setExpense] = useState(null);
  const [matchingExpenses, setMatchingExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summaryFilter, setSummaryFilter] = useState('');
  const [monthFilter, setMonthFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [uniqueSummaries, setUniqueSummaries] = useState([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/expenses`);
        const matchedExpense = response.data.find((exp) => String(exp._id) === String(_id));
        
        if (matchedExpense) {
          const matchedteamleadname = matchedExpense.teamLeadName;
          const Matching = response.data.filter((exp) => String(exp.teamLeadName) === matchedteamleadname);
          setExpense(matchedExpense); 
          setMatchingExpenses(Matching); 
          setFilteredExpenses(Matching);

          const summaries = [...new Set(Matching.map((exp) => exp.expenseSummary))];
          setUniqueSummaries(summaries);
        } else {
          setError('Expense not found'); 
        }
      } catch (error) {
        console.error('Failed to fetch expenses:', error);
        setError('Failed to fetch expenses'); 
      } finally {
        setLoading(false); 
      }
    };

    fetchExpenses();
  }, [_id]);

  useEffect(() => {
    const filterBySummaryMonthYear = () => {
      let filtered = matchingExpenses;
      if (summaryFilter) {
        filtered = filtered.filter((exp) => exp.expenseSummary === summaryFilter);
      }
      if (monthFilter) {
        filtered = filtered.filter((exp) => new Date(exp.Paydate).getMonth() + 1 === parseInt(monthFilter));
      }
      if (yearFilter) {
        filtered = filtered.filter((exp) => new Date(exp.Paydate).getFullYear() === parseInt(yearFilter));
      }
      setFilteredExpenses(filtered);
    };
    filterBySummaryMonthYear();
  }, [summaryFilter, monthFilter, yearFilter, matchingExpenses]);

  if (loading) {
    return <div><Loader/></div>;
  }

  const calculateTotalAmount = () => {
    return filteredExpenses.reduce((total, exp) => total + (exp.amount || 0), 0);
  };

  if (error) {
    return <div>{error}</div>; 
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return date.toLocaleDateString("en-US", options);
  };

  const months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  const years = Array.from(new Set(matchingExpenses.map((exp) => new Date(exp.Paydate).getFullYear())));

  const handlePrintClick = (expense) => {
    navigate('/print-page', { state: { expense } });
  };

  const handlePrintClick1 = () => {
    navigate('/FilteredPrintPage', { state: { expenses: filteredExpenses } });
  };

  const handleDeleteClick = async (id) => {
    try {
      // Delete the expense using the API
      await axios.delete(`${process.env.REACT_APP_API_URL}/expenses/${id}`);
      
      // Update filtered and matching expenses to reflect the deletion
      setFilteredExpenses(filteredExpenses.filter(exp => exp._id !== id));
      setMatchingExpenses(matchingExpenses.filter(exp => exp._id !== id));
      
      // If the deleted expense is the currently viewed expense, reset it
      if (expense && expense._id === id) {
        setExpense(null); 
      }
      
      alert('Expense deleted successfully');
    } catch (error) {
      console.error('Failed to delete expense:', error.response ? error.response.data : error.message);
      alert('Failed to delete expense');
    }
  };
  const handleEditClick = (expense) => {
    localStorage.setItem('editExpense', JSON.stringify(expense));
    navigate('/edit-expense'); // Navigate to the static edit page
  };
  return (
    <div className='main-content'>
      <h2 className='Headtext'>{expense ? expense.teamLeadName.toUpperCase() : ''} Expense Details</h2>
      <div className='whiteback'>
        {expense && (
          <p>Total Expenses by {expense.teamLeadName.toUpperCase()} <strong>({calculateTotalAmount()})</strong></p>
        )}
        <div className="filter-container d-flex justify-content-between">
          <div>
            <label htmlFor="summaryFilter">Filter by Summary: </label>
            <select id="summaryFilter" className="filter-select" value={summaryFilter} onChange={(e) => setSummaryFilter(e.target.value)}>
              <option value="">All Summaries</option>
              {uniqueSummaries.map((summary, index) => (
                <option key={index} value={summary}>
                  {summary}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="monthFilter">Filter by Month: </label>
            <select id="monthFilter" className="filter-select" value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)} >
              <option value="">All Months</option>
              {months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="yearFilter">Filter by Year: </label>
            <select id="yearFilter" className="filter-select" value={yearFilter} onChange={(e) => setYearFilter(e.target.value)} >
              <option value="">All Years</option>
              {years.map((year, index) => (
                <option key={index} value={year}> {year} </option>
              ))}
            </select>
          </div>
          <button onClick={handlePrintClick1} className='print-button'>Print Filtered Data</button>
        </div>
        {filteredExpenses.length > 0 ? (
          <>
            <table>
              <thead>
                <tr>
                  <th>Amount</th>
                  <th>Summary</th>
                  <th>Payment Date</th>
                  <th>Comment</th>
                  <th>Print</th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
              {filteredExpenses.map((exp) => (
                <tr key={exp._id}>
                  <td>{exp.amount}</td>
                  <td>{exp.expenseSummary}</td>
                  <td>{formatDate(exp.Paydate)}</td>
                  <td>{exp.comment}</td>
                  <td><button className='anchor' onClick={() => handlePrintClick(exp)}>Print</button></td>
                  <td><button className='anchor' onClick={() => handleEditClick(exp)}>Edit</button></td>
                  <td><img src="/deletebutton.png" className="delete" onClick={() => handleDeleteClick(exp._id)}
                      /></td>
                </tr>
              ))}
              </tbody>
            </table>
          </>
        ) : (
          <p>No expenses found for this filter criteria.</p>
        )}
      </div>
      
    </div>
  );
};

export default ExpensePaidByteamLeader;

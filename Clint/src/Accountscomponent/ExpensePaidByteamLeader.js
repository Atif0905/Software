import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Loader from '../Confirmation/Loader';
import './Accounts.css';

const ExpensePaidByteamLeader = () => {
  const { _id } = useParams(); 
  const [expense, setExpense] = useState(null);
  const [matchingExpenses, setMatchingExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summaryFilter, setSummaryFilter] = useState('');
  const [monthFilter, setMonthFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [uniqueSummaries, setUniqueSummaries] = useState([]);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchExpensesAndCustomers = async () => {
      try {
        const expenseResponse = await axios.get(`${process.env.REACT_APP_API_URL}/expenses`);
        const matchedExpense = expenseResponse.data.find((exp) => String(exp._id) === String(_id));        
        if (matchedExpense) {
          const matchedTeamLeadName = matchedExpense.teamLeadName;
          const Matching = expenseResponse.data.filter((exp) => String(exp.teamLeadName) === matchedTeamLeadName);
          setExpense(matchedExpense); 
          setMatchingExpenses(Matching); 
          setFilteredExpenses(Matching);
          const summaries = [...new Set(Matching.map((exp) => exp.expenseSummary))];
          setUniqueSummaries(summaries);
          const customerResponse = await axios.get(`${process.env.REACT_APP_API_URL}/viewcustomer`);
          const filteredCustomers = customerResponse.data.filter((customer) => String(customer.Teamleadname) === matchedTeamLeadName);
          setCustomers(filteredCustomers);
        } else {
          setError('Expense not found'); 
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setError('Failed to fetch data'); 
      } finally {
        setLoading(false); 
      }
    };
    fetchExpensesAndCustomers();
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

  return (
    <div className='main-content'>
      <h2 className='Headtext'>{expense.teamLeadName.toUpperCase()} Expense Details</h2>
      <div className='whiteback'>
        <p>Total Expenses by <strong>{expense.teamLeadName.toUpperCase()} ({calculateTotalAmount()})</strong></p>
        <div className="filter-container ">
          <label htmlFor="summaryFilter">Filter by Summary: </label>
          <select id="summaryFilter" className="filter-select" value={summaryFilter} onChange={(e) => setSummaryFilter(e.target.value)}>
            <option value=""><strong>All Summaries</strong></option>
            {uniqueSummaries.map((summary, index) => (
              <option key={index} value={summary}>
                <strong>{summary}</strong>
              </option>
            ))}
          </select>

          <label htmlFor="monthFilter">Filter by Month: </label>
          <select id="monthFilter" className="filter-select" value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)} >
            <option value="">All Months</option>
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
 
          <label htmlFor="yearFilter">Filter by Year: </label>
          <select id="yearFilter" className="filter-select" value={yearFilter} onChange={(e) => setYearFilter(e.target.value)} >
            <option value="">All Years</option>
            {years.map((year, index) => (
              <option key={index} value={year}> {year} </option>
            ))}
          </select>
        </div>

        {filteredExpenses.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Amount</th>
                <th>Summary</th>
                <th>Payment Date</th>
                <th>Comment</th>
                <th>Print</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((exp) => (
                <tr key={exp._id}>
                  <td>{exp.amount}</td>
                  <td>{exp.expenseSummary}</td>
                  <td>{formatDate(exp.Paydate)}</td>
                  <td>{exp.comment}</td>
                  <td>Print</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No expenses found for this filter criteria.</p>
        )}
      </div>
      <div className='whiteback mt-5'>
      <h3>Customers Managed by {expense.teamLeadName.toUpperCase()}</h3>
        {customers.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer._id}>
                  <td>{customer.name.toUpperCase()}</td>
                  <td>{customer.email}</td>
                  <td>{customer.mobileNumber}</td>
                  <td>{customer.address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No customers found for this team lead.</p>
        )}
      </div>
    </div>
  );
};

export default ExpensePaidByteamLeader;

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ViewCustomer = () => {
  // State to store the fetched customer data
  const [customers, setCustomers] = useState([]);

  // Function to fetch customer data from the backend
  const fetchCustomers = async () => {
    try {
      const apiUrl = `${process.env.REACT_APP_API_URL}/Viewcustomer`;
      const response = await axios.get(apiUrl);
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
      // Handle error as needed
    }
  };

  // Fetch customer data when the component mounts
  useEffect(() => {
    fetchCustomers();
  }, []); // Empty dependency array ensures this effect runs only once

  return (
    <div className='main-content'>
      <h1>Customer List</h1>
      <ul>
        {customers.map(customer => (
          <li key={customer._id}>{customer.name} - {customer.email}</li>
          // Adjust the property names according to your customer schema
        ))}
      </ul>
    </div>
  );
};

export default ViewCustomer;

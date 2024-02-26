import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/Viewcustomer`);
        const customersWithDetails = await Promise.all(response.data.map(async (customer) => ({
          ...customer,
          projectName: await fetchName('getProject', customer.project),
          blockName: await fetchName('getBlock', customer.project, customer.block),
          unitName: await fetchName('getUnit', customer.project, customer.block, customer.plotOrUnit),
         
        })));
        setCustomers(customersWithDetails);
      } catch (error) {
        console.error('Error fetching customers:', error);
        setError('Error fetching customers. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCustomers();
  }, []);

  const fetchName = async (endpoint, ...ids) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/${endpoint}/${ids.join('/')}`);
      return response.data.data.name;
    } catch (error) {
      console.error(`Error fetching ${endpoint} name:`, error);
      return 'Unknown';
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className='main-content'>
      <h2 className='Headtext'>Customer List</h2>
      <div className="table-wrapper whiteback">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Aadhar Number</th>
              <th>Mobile Number</th>
              <th>Email</th>
              <th>Project</th>
              <th>Block-Plot/Unit</th>
              <th>Payment Received</th>
              <th>Send Email</th>
              <th>Payment Plan</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer, index) => (
              <tr key={index}>
                <td>{customer.name}</td>
                <td>{customer.aadharNumber}</td>
                <td>{customer.mobileNumber}</td>
                <td>{customer.email}</td>
                <td>{customer.projectName}</td>
                <td>{customer.blockName}-{customer.unitName}</td>
                <td>{customer.paymentReceived}</td>
                <td>{customer.sendEmail ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerList;

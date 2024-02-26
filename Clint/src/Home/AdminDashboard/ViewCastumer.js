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
        const customersWithDetails = await Promise.all(response.data.map(async (customer) => {
          const projectName = await fetchName('getProject', customer.project);
          const blockName = await fetchName('getBlock', customer.project, customer.block);
          const unitName = await fetchName('getUnit', customer.project, customer.block, customer.plotOrUnit);
          const unitPrice = await fetchUnitPrice(customer.project, customer.block, customer.plotOrUnit); // Fetch unit price
          
          return {
            ...customer,
            projectName,
            blockName,
            unitName,
            unitPrice,
          };
        }));
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

  const fetchUnitPrice = async (projectId, blockId, unitId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/getUnit/${projectId}/${blockId}/${unitId}`);
      return response.data.data.totalPrice; // Assuming unitPrice is a property of the unit object
    } catch (error) {
      console.error('Error fetching unit price:', error);
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
              <th>Unit Price</th>
              <th>Payment Received</th>
              <th>Balance</th>
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
                <td>{customer.unitPrice}</td>
                <td>{customer.paymentReceived}</td>
                <td>{customer.unitPrice - customer.paymentReceived}</td> {/* Calculating balance */}
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

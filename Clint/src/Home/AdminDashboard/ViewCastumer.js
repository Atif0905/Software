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
      <h2>Customer List</h2>
      <div className="table-container">
        <table id="myTable">
          <thead>
            <tr>
              <th>Name</th>
              <th>Father/Husband Name</th>
              <th>Address</th>
              <th>Aadhar Number</th>
              <th>PAN Number</th>
              <th>Mobile Number</th>
              <th>Email</th>
              <th>Property Type</th>
              <th>Project</th>
              <th>Block</th>
              <th>Plot/Unit</th>
              <th>Discount</th>
              <th>Payment Plan</th>
              <th>Booking Date</th>
              <th>Booking Type</th>
              <th>Send Email</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer, index) => (
              <tr key={index}>
                <td>{customer.name}</td>
                <td>{customer.fatherOrHusbandName}</td>
                <td>{customer.address}</td>
                <td>{customer.aadharNumber}</td>
                <td>{customer.panNumber}</td>
                <td>{customer.mobileNumber}</td>
                <td>{customer.email}</td>
                <td>{customer.propertyType}</td>
                <td>{customer.projectName}</td>
                <td>{customer.blockName}</td>
                <td>{customer.unitName}</td>
                <td>{customer.discount}</td>
                <td>{customer.paymentPlan}</td>
                <td>{customer.bookingDate}</td>
                <td>{customer.bookingType}</td>
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

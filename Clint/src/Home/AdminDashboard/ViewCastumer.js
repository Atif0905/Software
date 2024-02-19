import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css'

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/customers`);
        const customersWithProjectNames = await Promise.all(response.data.map(async (customer) => {
          const [projectName, blockName, unitName] = await Promise.all([
            fetchProjectName(customer.project),
            fetchBlockName(customer.project, customer.block),
            fetchUnitName(customer.project, customer.block, customer.plotOrUnit)
          ]);
          return { ...customer, projectName, blockName, unitName };
        }));
        setCustomers(customersWithProjectNames);
      } catch (error) {
        console.error('Error fetching customers:', error);
        setError('Error fetching customers. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const fetchData = async (url) => {
    try {
      const response = await axios.get(url);
      return response.data.data.name;
    } catch (error) {
      console.error('Error fetching data:', error);
      return 'Unknown';
    }
  };

  const fetchProjectName = async (projectId) => {
    if (!projectId) return 'Unknown Project';
    return fetchData(`${process.env.REACT_APP_API_URL}/getProject/${projectId}`);
  };

  const fetchBlockName = async (projectId, blockId) => {
    if (!projectId || !blockId) return 'Unknown Block';
    return fetchData(`${process.env.REACT_APP_API_URL}/getBlock/${projectId}/${blockId}`);
  };

  const fetchUnitName = async (projectId, blockId, unitId) => {
    if (!projectId || !blockId || !unitId) return 'Unknown Unit';
    return fetchData(`${process.env.REACT_APP_API_URL}/getUnit/${projectId}/${blockId}/${unitId}`);
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

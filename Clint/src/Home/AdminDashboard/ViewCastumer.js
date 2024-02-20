import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css'

const ViewCastumer = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/Viewcustomer`);

        const promises = response.data.map(async (customer) => {
          const projectNamePromise = fetchProjectName(customer.project);
          const blockNamePromise = fetchBlockName(customer.project, customer.block);
          const unitNamePromise = fetchUnitName(customer.project, customer.block, customer.plotOrUnit);

          const [projectName, blockName, unitName] = await Promise.all([
            projectNamePromise,
            blockNamePromise,
            unitNamePromise
          ]);

          return { ...customer, projectName, blockName, unitName };
        });

        const customersWithProjectNames = await Promise.all(promises);

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

export default ViewCastumer;

// Function to fetch project name
const fetchProjectName = async (projectId) => {
  try {
    if (!projectId) throw new Error('Project ID is not defined');
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/getProject/${projectId}`);
    return response.data.data.name;
  } catch (error) {
    console.error(`Error fetching project name for ID ${projectId}:`, error);
    return 'Unknown Project';
  }
};

// Function to fetch block name
const fetchBlockName = async (projectId, blockId) => {
  try {
    if (!projectId || !blockId) throw new Error('Project ID or Block ID is not defined');
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/getBlock/${projectId}/${blockId}`);
    return response.data.data.name;
  } catch (error) {
    console.error(`Error fetching block name for ID ${blockId} in project ${projectId}:`, error);
    return 'Unknown Block';
  }
};

// Function to fetch unit name
const fetchUnitName = async (projectId, blockId, unitId) => {
  try {
    if (!projectId || !blockId || !unitId) throw new Error('Project ID, Block ID, or Unit ID is not defined');
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/getUnit/${projectId}/${blockId}/${unitId}`);
    return response.data.data.name;
  } catch (error) {
    console.error(`Error fetching unit name for ID ${unitId} in block ${blockId} of project ${projectId}:`, error);
    return 'Unknown Unit';
  }
};

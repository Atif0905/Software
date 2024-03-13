import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';
const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);
useEffect(() => {
  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/Viewcustomer`);
      console.log(response);
      const customersWithDetails = await Promise.all(response.data.map(async (customer) => {
        const projectName = await fetchName('getProject', customer.project);
        const blockName = await fetchName('getBlock', customer.project, customer.block);
        const unitName = await fetchName('getUnit', customer.project, customer.block, customer.plotOrUnit);
        const unitDetails = await fetchUnitDetails(customer.project, customer.block, customer.plotOrUnit);
        const paymentDetails = await fetchPaymentDetailsByCustomerId(customer.customerId);
        
        return {
          ...customer,
          projectName: projectName.toUpperCase(),
          blockName: blockName.toUpperCase(),
          unitName: unitName.toUpperCase(),
          ...unitDetails,
          paymentDetails: paymentDetails.data // Assigning all payment details
        };
      }));
      setCustomers(customersWithDetails);
      const totalAmounts = calculateTotalAmounts(customersWithDetails);
      setPaymentDetails(totalAmounts);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setError('Error fetching customers. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  fetchCustomers();
}, []);

  
  const fetchPaymentDetailsByCustomerId = async (customerId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/paymentDetails/${customerId}`);
      console.log(response)
      return response.data;
    } catch (error) {
      console.error('Error fetching payment details:', error);
      // If payment details cannot be fetched, return an empty array to prevent errors
      return { data: [] };
    }
  };
  const fetchName = async (endpoint, ...ids) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/${endpoint}/${ids.join('/')}`);
      return response.data.data.name;
    } catch (error) {
      console.error(`Error fetching ${endpoint} name:`, error);
      return 'Unknown';
    }
  };
  const fetchUnitDetails = async (projectId, blockId, unitId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/getUnit/${projectId}/${blockId}/${unitId}`);
      console.log(response)
      const unitData = response.data.data;
      return {
        unitPrice: unitData.totalPrice,
        idcCharges: unitData.idcCharges,
        plcCharges: unitData.plcCharges,
        plotSize: unitData.plotSize,
        sizeType: unitData.sizeType,
        rate: unitData.rate,
        edcPrice: unitData.edcPrice
      };
    } catch (error) {
      console.error('Error fetching unit details:', error);
      return {
        unitPrice: 'Unknown',
        idcCharges: 'Unknown',
        plcCharges: 'Unknown',
        plotSize: 'Unknown',
        sizeType: 'Unknown',
        rate: 'unknown',
        edcPrice: 'unknown'
      };
    }
  };
  const calculateTotalAmounts = (customers) => {
    const totalAmounts = {};
    customers.forEach(customer => {
      const customerId = customer.customerId;
      const totalAmountReceived = customer.paymentDetails.reduce((sum, payment) => sum + payment.amount, 0);
      totalAmounts[customerId] = totalAmountReceived;
    });
    return totalAmounts;
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return date.toLocaleDateString('en-US', options);
  };
  const total = selectedCustomer ?
    (parseFloat(selectedCustomer.rate) + parseFloat(selectedCustomer.plcCharges) + parseFloat(selectedCustomer.idcCharges) + parseFloat(selectedCustomer.edcPrice)) * parseFloat(selectedCustomer.plotSize)
    : 0;
  const totalAmount = paymentDetails ? Object.values(paymentDetails).reduce((sum, amount) => sum + amount, 0) : 0;

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }
  const totalAmountsReceived = paymentDetails || {};
  const handleViewDetails = async (customer) => {
    if (selectedCustomer && selectedCustomer.customerId === customer.customerId) {
      setSelectedCustomer(null);
    } else {
      setSelectedCustomer(customer);
    }
  };
  return (
    <div className='main-content'>
      <h2 className='Headtext'>Customer List</h2>
      <div className="table-wrapper whiteback">
        <table id='viewcustomertable'>
          <thead>
            <tr>
              <th>CUSTOMER ID</th>
              <th>NAME</th>
              <th>CONTACT NUMBER</th>
              <th>EMAIL</th>
              <th>PROJECT</th>
              <th>BLOCK-PLOT/UNIT</th>
              <th>UNIT PRICE</th>
              <th>PAYMENT RECEIVED</th>
              <th>BALANCE</th>
              <th>PAYMENT PLAN</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer, index) => (
              <tr key={index}>
                <td>{customer.customerId ? customer.customerId.toUpperCase() : ''}</td>
                <td>
                  <button className='anchorbutton' onClick={() => handleViewDetails(customer)}>{customer.name ? customer.name.toUpperCase() : ''}</button>
                </td>
                <td>{customer.mobileNumber}</td>
                <td>{customer.email ? customer.email.toUpperCase() : ''}</td>
                <td>{customer.projectName}</td>
                <td>{customer.blockName}-{customer.unitName}</td>
                <td>{customer.unitPrice}</td>
                <td>{totalAmountsReceived[customer.customerId]}</td>
                <td>{customer.unitPrice - totalAmountsReceived[customer.customerId]}</td>
                <td>{customer.paymentPlan}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedCustomer && (
        <div className='whiteback mt-5'>
          <table id='firsttable'>
            <thead>
              <tr>
                <th>NAME</th>
                <th>ADDRESS</th>
                <th>CONTACT NUMBER</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{selectedCustomer.name ? selectedCustomer.name.toUpperCase() : ''}</td>
                <td>{selectedCustomer.address ? selectedCustomer.address.toUpperCase() : ''}</td>
                <td>{selectedCustomer.mobileNumber ? selectedCustomer.mobileNumber.toUpperCase() : ''}</td>
              </tr>
            </tbody>
          </table>
          <table id="customer-details-table">
            <tbody>
              <tr>
                <td><strong>Plot Size:</strong></td>
                <td>{selectedCustomer.plotSize} {selectedCustomer.sizeType}</td>
                <td><strong>Plot No:</strong></td>
                <td>{selectedCustomer.blockName}-{selectedCustomer.unitName}</td>
              </tr>
              <tr>
                <td><strong>Booking Date:</strong></td>
                <td>{formatDate(selectedCustomer.bookingDate)}</td>
                <td><strong>Basic price :</strong></td>
                <td> BSP RATE {selectedCustomer.rate} /-{selectedCustomer.sizeType} INR / {selectedCustomer.rate * selectedCustomer.plotSize}</td>
              </tr>
              <tr>
                <td><strong>IDC Charges:</strong> </td>
                <td>{selectedCustomer.idcCharges * selectedCustomer.plotSize} INR / {selectedCustomer.idcCharges}</td>
                <td><strong>PLC Charges</strong></td>
                <td>{selectedCustomer.plcCharges * selectedCustomer.plotSize} INR / {selectedCustomer.plcCharges}</td>
              </tr>
              <tr>
              <td><strong>EDC Charges</strong></td>
                <td>{selectedCustomer.edcPrice * selectedCustomer.plotSize} INR / {selectedCustomer.edcPrice}</td>
                <td><strong>Total Price</strong></td>
                <td>{total}</td>
              </tr>
              <tr>
              <td><strong>Total Payment Amount</strong></td>
                <td>{totalAmountsReceived[selectedCustomer.customerId]}</td>
                <td><strong>Balance</strong></td>
                <td>{selectedCustomer.unitPrice - totalAmountsReceived[selectedCustomer.customerId]}</td>
              </tr>
            </tbody>
          </table>
          {selectedCustomer.paymentDetails && selectedCustomer.paymentDetails.length > 0 && ( 
            <div>
              <h3>Payment Details</h3>
              <table>
                <thead>
                  <tr>
                    <th>Payment Date</th>
                    <th>Received Amount</th>
                    <th>Comment</th>
                    <th>Payment Mode</th>
                    <th>Payment Type</th>
                    <th>Reference</th>
                  </tr>
                </thead>
                <tbody>
                {selectedCustomer.paymentDetails.map((payment, index) => (
                    <tr key={index}>
                      <td>{new Date(payment.PaymentDate).toLocaleDateString()}</td>
                      <td>{payment.amount}</td>
                      <td>{payment.comment}</td>
                      <td>{payment.paymentMode}</td>
                      <td>{payment.paymentType}</td>
                      <td>{payment.reference}</td>
                    </tr> 
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default CustomerList;
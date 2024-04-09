import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const CustomerDetails = () => {
    const { _id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);
  useEffect(() => {
    const fetchCustomerDetails = async () => {
        try {
            const customerResponse = await axios.get(`${process.env.REACT_APP_API_URL}/Viewcustomer`);
            const matchedCustomer = customerResponse.data.find((c) => c._id === _id);
            if (matchedCustomer) {
                const projectName = await fetchName('getProject', matchedCustomer.project);
                const blockName = await fetchName('getBlock', matchedCustomer.project, matchedCustomer.block);
                const unitName = await fetchName('getUnit', matchedCustomer.project, matchedCustomer.block, matchedCustomer.plotOrUnit);
                const unitDetails = await fetchUnitDetails(matchedCustomer.project, matchedCustomer.block, matchedCustomer.plotOrUnit);
                const paymentDetailsResponse = await fetchPaymentDetailsByCustomerId(matchedCustomer.customerId);

                const updatedCustomer = {
                    ...matchedCustomer,
                    projectName: projectName.toUpperCase(),
                    blockName: blockName.toUpperCase(),
                    unitName: unitName.toUpperCase(),
                    paymentDetails: paymentDetailsResponse.data,
                    ...unitDetails,
                };

                setCustomer(updatedCustomer);
                setPaymentDetails(paymentDetailsResponse.data);
            } else {
                setError('Customer not found.');
            }
        } catch (error) {
            console.error('Error fetching customer details:', error);
            setError('Error fetching customer details. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    if (_id) {
        fetchCustomerDetails();
    } else {
        setError('No customer ID provided.');
        setLoading(false);
    }
}, [_id]);

const fetchPaymentDetailsByCustomerId = async (customerId) => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/paymentDetails/${customerId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching payment details:', error);
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
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return date.toLocaleDateString('en-US', options);
  };
  const total = customer ?
    (parseFloat(customer.rate) + parseFloat(customer.plcCharges) + parseFloat(customer.idcCharges) + parseFloat(customer.edcPrice)) * parseFloat(customer.plotSize)
    : 0;
    const totalAmountsReceived = paymentDetails || {};
    const calculateTotalAmounts = (customer) => {
      if (customer && customer.paymentDetails && customer.paymentDetails.length > 0) {
          return customer.paymentDetails.reduce((sum, payment) => sum + payment.amount, 0);
      } else {
          return 0;
      }
  };
  return (
    <div className='main-content'>
      <h2 className='Headtext'>Customer List</h2>
      <div className="table-wrapper whiteback">
        {customer && (
          <table id='firsttable'>
              <tr>
                <th>NAME</th>
                <th>Address</th>
                <th>CONTACT NUMBER</th>
                </tr>
            <tbody>
              <tr>
                <td>{customer.name ? customer.name.toUpperCase() : ''}</td>
                <td>{customer.address ? customer.address.toUpperCase() : ''}</td>
                <td>{customer.mobileNumber}</td>
                  </tr>
                  <tr>
                <td><strong>Plot Size:</strong></td>
                <td>{customer.plotSize} {customer.sizeType}</td>
                <td><strong>Plot No:</strong></td>
                <td>{customer.blockName}-{customer.unitName}</td>
              </tr>
              <tr>
                <td><strong>Booking Date:</strong></td>
                <td>{formatDate(customer.bookingDate)}</td>
                <td><strong>Basic price :</strong></td>
                <td> BSP RATE {customer.rate} /-{customer.sizeType} INR / {customer.rate * customer.plotSize}</td>
              </tr>
              <tr>
                <td><strong>IDC Charges:</strong> </td>
                <td>{customer.idcCharges * customer.plotSize} INR / {customer.idcCharges}</td>
                <td><strong>PLC Charges</strong></td>
                <td>{customer.plcCharges * customer.plotSize} INR / {customer.plcCharges}</td>
              </tr>
              <tr>
              <td><strong>EDC Charges</strong></td>
                <td>{customer.edcPrice * customer.plotSize} INR / {customer.edcPrice}</td>
                <td><strong>Total Price</strong></td>
                <td>{total}</td>
              </tr>
              <tr>
              <td><strong>Total Payment Done</strong></td>
                <td>{calculateTotalAmounts(customer)}</td>
                <td><strong>Balance</strong></td>
                <td>{total - calculateTotalAmounts(customer)}</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
      {paymentDetails && (
                <div className="payment-details">
                    <h3>Payment Details</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Amount</th>
                                <th>Payment Mode</th>
                                <th>Comment</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paymentDetails.map((payment, index) => (
                                <tr key={index}>
                                    <td>{formatDate(payment.PaymentDate)}</td>
                                    <td>{payment.amount}</td>
                                    <td>{payment.paymentMode}</td>
                                    <td>{payment.comment}</td>
                          
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
    </div>
  );
};

export default CustomerDetails;

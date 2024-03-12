import React, { useState, useEffect } from "react";
import axios from "axios";
import './Payments.css'
const Unclearcheque = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [paymentDetails, setPaymentDetails] = useState(null);
    useEffect(() => {
        const fetchCustomers = async () => {
          try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/Viewcustomer`);
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
                paymentDetails: paymentDetails.data
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
      const fetchPaymentDetailsByCustomerId = async (customerId) => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/paymentDetails/${customerId}`);
          console.log(response)
          return response.data;
        } catch (error) {
          console.error('Error fetching payment details:', error);
          throw new Error('Error fetching payment details. Please try again later.');
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
            unitPrice: unitData.totalPrice.toUpperCase(),
            idcCharges: unitData.idcCharges.toUpperCase(),
            plcCharges: unitData.plcCharges.toUpperCase(),
            plotSize: unitData.plotSize.toUpperCase(),
            sizeType: unitData.sizeType.toUpperCase(),
            rate: unitData.rate.toUpperCase()
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
          };
        }
      };
      
  const handleStatusChange = (index, paymentIndex) => {
    // Create a copy of the customers array to modify
    const updatedCustomers = [...customers];
    // Toggle the status from "Pending" to "Approved"
    updatedCustomers[index].paymentDetails[paymentIndex].status = 'Approved';
    // Update state with the modified customers array
    setCustomers(updatedCustomers);
  };
  return (
    <div className='main-content'>
        <h4 className='Headtext'>Uncleared Cheques Details</h4>
        <div className='whiteback'>
        <table>
            <thead>
                <tr>
                    <th>Customer ID</th>
                    <th>Customer Name</th>
                    <th>Project</th>
                    <th>unit details</th>
                    <th>Amount</th>
                    <th>instrument no</th>
                    <th>instrument Date</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
            {customers
  .filter(customer => customer.paymentDetails.some(paymentDetail => paymentDetail.paymentMode === "cheque"))
  .map((customer, index) => (
    customer.paymentDetails
      .filter(paymentDetail => paymentDetail.paymentMode === "cheque")
      .map((paymentDetail, paymentIndex) => (
        <tr key={`${index}-${paymentIndex}`}>
          <td>{customer.customerId}</td>
          <td>{customer.name}</td>
          <td>{customer.projectName}</td>
          <td>{customer.blockName}- {customer.unitName}</td>
          <td>{paymentDetail.amount}</td>
          <td>{paymentDetail.reference}</td>
          <td>{new Date(paymentDetail.PaymentDate).toLocaleDateString()}</td>
          <td 
                      className="butt" 
                      onClick={() => handleStatusChange(index, paymentIndex)}
                    >
                      {paymentDetail.status === 'Pending' ? 'Pending' : 'Approved'}
                    </td>
        </tr>
      ))
))}


            </tbody>
        </table>
        </div>
    </div>
  )
}
export default Unclearcheque
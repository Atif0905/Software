import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { setCustomers, setError } from '../Actions/Actions'; 
import { setLoading } from '../Actions/Actions';

const Stats = () => {
    const { customers, loading, error } = useSelector(state => state.customer);
    const dispatch = useDispatch();
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
              paymentDetails: paymentDetails.data 
            };
          }));
          setCustomers(customersWithDetails);
          const totalAmounts = calculateTotalAmounts(customersWithDetails);
          dispatch(setCustomers(customersWithDetails));
        } catch (error) {
          dispatch(setError('Error fetching customers. Please try again later.'));
        } finally {
          dispatch(setLoading(true));
        }
      };
      fetchCustomers();
    }, [dispatch]);
    const fetchPaymentDetailsByCustomerId = async (customerId) => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/paymentDetails/${customerId}`);
        return response.data;
      } catch (error) {
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
    const calculateTotalAmounts = (customers) => {
      const totalAmounts = {};
      customers.forEach(customer => {
        const customerId = customer.customerId;
        const totalAmountReceived = customer.paymentDetails.reduce((sum, payment) => sum + payment.amount, 0);
        totalAmounts[customerId] = totalAmountReceived;
      });
      return totalAmounts;
    };
    if (loading) {
      return <div>Loading...</div>;
    }
  return (
    <div className='main-content'>
        <h2 className='mt-5'>Stats of All Directors</h2>
        <div className="table-wrapper whiteback">
        <table id='viewcustomertable'>
          <thead>
            <tr>
              <th>Director Name</th> 
              <th>Team Lead Name</th> 
              <th>PROJECT Name</th>
              <th>BLOCK-PLOT</th>
              <th>UNIT NO</th>
              <th>UNIT PRICE</th>
              <th>PAYMENT RECEIVED</th>
              <th>BALANCE</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer, index) => (
              <tr key={index}>
                <td>{customer.EmployeeName.toUpperCase()}</td>
                <td>{customer.Teamleadname.toUpperCase()}</td>
                <td>{customer.projectName}</td>
                <td>{customer.blockName}</td>
                <td>{customer.unitName}</td>
                <td>{customer.unitPrice}</td>
                <td>{customer.paymentDetails ? customer.paymentDetails.reduce((sum, payment) => sum + payment.amount, 0) : 0}</td>
                <td>{customer.unitPrice - (customer.paymentDetails ? customer.paymentDetails.reduce((sum, payment) => sum + payment.amount, 0) : 0)}</td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Stats
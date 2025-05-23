import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCustomers, setError, setLoading } from '../Actions/Actions';
import Loader from '../Confirmation/Loader';
import { fetchCustomers, fetchName, fetchUnitDetails, fetchPaymentDetailsByCustomerId } from '../services/customerService'; 
import { Link } from 'react-router-dom';
import useFetchUser from '../hooks/useFetchUser'; 
const Subadminviewcustomer = () => {
  const { customers, loading, error } = useSelector((state) => state.customer);
  const dispatch = useDispatch();
  const { subAdmin, loading: userLoading } = useFetchUser();
  useEffect(() => {
    const getCustomers = async () => {
      dispatch(setLoading(true));
      try {
        const customersData = await fetchCustomers();
        const assgProject = subAdmin ? subAdmin.AssgProject : null;
        const customersWithDetails = await Promise.all(
          customersData.map(async (customer) => {
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
              paymentDetails: paymentDetails.data,
            };
          })
        );
        const filteredCustomers = customersWithDetails.filter(customer => 
          customer.projectName === assgProject?.toUpperCase()
        );

        dispatch(setCustomers(filteredCustomers));
      } catch (error) {
        dispatch(setError('Error fetching customers. Please try again later.'));
      } finally {
        dispatch(setLoading(false));
      }
    };

    getCustomers();
  }, [dispatch, subAdmin]);

  if (loading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return (
    <div className='main-content'>
      <div className="table-wrapper formback1">
        <h2 className='formhead'>Customer List</h2>
        <div className='formback1'>
          <table>
            <thead>
              <tr className="formtablehead1">
                <th>CUSTOMER ID</th>
                <th>NAME</th>
                <th>CONTACT NUMBER</th>
                <th>EMAIL</th>
                <th>PROJECT</th>
                <th>BLOCK-PLOT/UNIT</th>
                <th>UNIT PRICE</th>
                <th>PAYMENT RECEIVED</th>
                <th>BALANCE</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer, index) => (
                <tr key={index}>
                  <td>{customer.customerId ? customer.customerId.toUpperCase() : ''}</td>
                  <td>
                    <Link to={`/Sub-Admin-customer-details/${customer._id}`}>
                      {customer.name ? customer.name.toUpperCase() : ''}
                    </Link>
                  </td>
                  <td>{customer.mobileNumber}</td>
                  <td>{customer.email ? customer.email : ''}</td>
                  <td>{customer.projectName}</td>
                  <td>{customer.blockName}-{customer.unitName}</td>
                  <td>{customer.unitPrice}</td>
                  <td>
                    {customer.paymentDetails ? customer.paymentDetails.reduce((sum, payment) => sum + payment.amount, 0) : 0}
                  </td>
                  <td>
                    {customer.unitPrice - (customer.paymentDetails ? customer.paymentDetails.reduce((sum, payment) => sum + payment.amount, 0) : 0)}
                  </td>
                  <td>
                    <Link to={`/Sub-Admin-Edit-customer-details/${customer._id}`}>Edit Details</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Subadminviewcustomer;

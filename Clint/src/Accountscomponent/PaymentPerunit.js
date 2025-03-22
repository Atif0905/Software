import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCustomers, setError, setLoading } from '../Actions/Actions';
import Loader from '../Confirmation/Loader';
import {fetchCustomers,fetchName,fetchUnitDetails,fetchPaymentDetailsByCustomerId,fetchProjectRate,} from '../services/customerService'; 
const PaymentPerunit = () => {
  const { customers, loading, error } = useSelector((state) => state.customer);
  const dispatch = useDispatch();

  useEffect(() => {
    const getCustomers = async () => {
      dispatch(setLoading(true));
      try {
        const customersData = await fetchCustomers();
        const customersWithDetails = await Promise.all(
          customersData.map(async (customer) => {
            const projectName = await fetchName('getProject', customer.project);
            const projectRate = await fetchProjectRate(customer.project); // Fetch Bsprate
            const blockName = await fetchName('getBlock', customer.project, customer.block);
            const unitName = await fetchName('getUnit', customer.project, customer.block, customer.plotOrUnit);
            const unitDetails = await fetchUnitDetails(customer.project, customer.block, customer.plotOrUnit);
            const paymentDetails = await fetchPaymentDetailsByCustomerId(customer.customerId);

            return {
              ...customer,
              projectName: projectName.toUpperCase(),
              projectRate: projectRate,
              blockName: blockName.toUpperCase(),
              unitName: unitName.toUpperCase(),
              ...unitDetails,
              paymentDetails: paymentDetails.data,
            };
          })
        );
        dispatch(setCustomers(customersWithDetails));
      } catch (error) {
        dispatch(setError('Error fetching customers. Please try again later.'));
      } finally {
        dispatch(setLoading(false));
      }
    };

    getCustomers();
  }, [dispatch]);

  return (
    <div className="main-content">
      {loading ? (
        <div className="d-flex justify-content-center">
          <Loader />
        </div>
      ) : (
        <div className='formback2'>
          <h2 className="formhead">Payment Per Unit (Sold Unit)</h2>
          <div className=" formback1">
          <table className='unit-table'>
              <thead>
                <tr>
                  <th>Client Name</th>
                  <th>PROJECT NAME</th>
                  <th>BLOCK-PLOT</th>
                  <th>UNIT NO</th>
                  <th>COMPANY DEMAND</th>
                  <th>UNIT SOLD AT</th>
                  <th>BROKERAGE</th>
                  <th>Total Brokerage</th>
                  <th>UNIT PRICE</th>
                  <th>PAYMENT RECEIVED</th>
                  <th>BALANCE</th>
                  <th>PAYMENT RECEIVED IN %</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer, index) => (
                  <tr key={index}>
                    <td>{customer.name.toUpperCase()}</td>
                    <td>{customer.projectName}</td>
                    <td>{customer.blockName}</td>
                    <td>{customer.unitName}</td>
                    <td>{customer.projectRate || 0}</td>
                    <td>{customer.unitPrice / customer.plotSize}</td>
                    <td>
                      {(customer.unitPrice / customer.plotSize - customer.projectRate) || 0}/ {customer.plotSize}{' '}
                      {customer.sizeType}
                    </td>
                    <td>{customer.unitPrice - customer.projectRate * customer.plotSize || 0}</td>
                    <td>{customer.unitPrice}</td>
                    <td>
                      {customer.paymentDetails
                        ? customer.paymentDetails.reduce((sum, payment) => sum + payment.amount, 0)
                        : 0}
                    </td>
                    <td>
                      {customer.unitPrice -
                        (customer.paymentDetails
                          ? customer.paymentDetails.reduce((sum, payment) => sum + payment.amount, 0)
                          : 0)}
                    </td>
                    <td
                      style={{
                        color:
                          (customer.paymentDetails
                            ? (customer.paymentDetails.reduce((sum, payment) => sum + payment.amount, 0) /
                                customer.unitPrice) *
                              100
                            : 0) < 50
                            ? 'red'
                            : (customer.paymentDetails.reduce((sum, payment) => sum + payment.amount, 0) /
                                customer.unitPrice) *
                                100 <=
                              80
                            ? '#f59e0b'
                            : '#047857',
                      }}
                    >
                      {parseFloat(
                        ((customer.paymentDetails
                          ? customer.paymentDetails.reduce((sum, payment) => sum + payment.amount, 0)
                          : 0) /
                          customer.unitPrice) *
                          100
                      ).toFixed(2)}
                      %
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
export default PaymentPerunit;
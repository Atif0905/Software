import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { setCustomers, setError, setLoading } from '../Actions/Actions'; 
import { Link } from 'react-router-dom';
import Loader from '../Confirmation/Loader';
const DirectorsReport = () => {
  const { customers, loading, error } = useSelector(state => state.customer);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCustomers = async () => {
      dispatch(setLoading(true));
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/Viewcustomer`);
        const customersWithDetails = await Promise.all(response.data.map(async (customer) => {
          return {
            ...customer,
          };
        }));
        dispatch(setCustomers(customersWithDetails));
      } catch (error) {
        dispatch(setError('Error fetching customers. Please try again later.'));
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetchCustomers();
  }, [dispatch]);
  if (loading) {
    return <div className='mt-5'><Loader/></div>;
  }
  const renderedEmployeeNames = new Set();
  return (
    <div className='main-content'>
            <div >
        {loading ? (
          <div className="d-flex justify-content-center">
          <Loader />
          </div>
        ) : (
          <div>
      <h2 className='Headtext'>Directors Report</h2>
      <div className="table-wrapper whiteback">
        <table id='viewcustomertable'>
          <thead>
            <tr>
              <th>Director Name</th> 
            </tr>
          </thead>
          <tbody>
            {customers.map((customer, index) => {
              if (!renderedEmployeeNames.has(customer.EmployeeName)) {
                renderedEmployeeNames.add(customer.EmployeeName);
                return (
                  <tr key={index}>
                    <Link to={`/DirectorDetails/${customer._id}`}><td>{customer.EmployeeName.toUpperCase()}</td></Link> 
                  </tr>
                );
              }
              return null;
            })}
          </tbody>
        </table>
      </div>
      </div>
      )}
      </div>
    </div>
  )
}

export default DirectorsReport;

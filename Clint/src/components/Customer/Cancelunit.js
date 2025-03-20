import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCustomers, setError, setLoading } from '../../Actions/Actions';
import Loader from '../../Confirmation/Loader';
import { fetchCustomers, fetchName, fetchUnitDetails, fetchPaymentDetailsByCustomerId } from '../../services/customerService';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx'; // Import xlsx library

const Cancelunit = () => {
  const { customers, loading, error } = useSelector((state) => state.customer);
  const dispatch = useDispatch();

  const [selectedProject, setSelectedProject] = useState('');
  const [projectNames, setProjectNames] = useState([]);

  useEffect(() => {
    const getCustomers = async () => {
      dispatch(setLoading(true));
      try {
        const customersData = await fetchCustomers();
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

        const uniqueProjectNames = [...new Set(customersWithDetails.map((c) => c.projectName))];
        setProjectNames(uniqueProjectNames);
        dispatch(setCustomers(customersWithDetails));
      } catch (error) {
        dispatch(setError('Error fetching customers. Please try again later.'));
      } finally {
        dispatch(setLoading(false));
      }
    };

    getCustomers();
  }, [dispatch]);

  const filteredCustomers = selectedProject
  ? customers.filter((customer) => customer.projectName === selectedProject && customer.status === "Current")
  : customers.filter((customer) => customer.status === "Canceled");


  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredCustomers.map((customer) => ({
        CustomerID: customer.customerId,
        Name: customer.name,
        Contact: customer.mobileNumber,
        Email: customer.email,
        Project: customer.projectName,
        BlockPlotUnit: `${customer.blockName}-${customer.unitName}`,
        UnitPrice: customer.unitPrice,
        PaymentReceived: customer.paymentDetails
          ? customer.paymentDetails.reduce((sum, payment) => sum + payment.amount, 0)
          : 0,
        Balance:
          customer.unitPrice -
          (customer.paymentDetails
            ? customer.paymentDetails.reduce((sum, payment) => sum + payment.amount, 0)
            : 0),
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Customers');
    XLSX.writeFile(workbook, 'customers.xlsx');
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const importedData = XLSX.utils.sheet_to_json(worksheet);
        console.log(importedData); // Handle the imported data as needed
      };
      reader.readAsArrayBuffer(file);
    }
  };

  if (loading) {
    return <Loader />;
  }

  const totalPayment = filteredCustomers.reduce(
    (sum, customer) =>
      sum +
      (customer.paymentDetails
        ? customer.paymentDetails.reduce((subSum, payment) => subSum + payment.amount, 0)
        : 0),
    0
  );

  return (
    <div className="main-content">
      <div className="filter-section">
          <button className=' btn btn-success ' onClick={handleExport}>Export to Excel</button>
       </div>
      <div className="table-wrapper formback1 mt-4">
        <h2 className="formhead"> Canceled Customer List</h2>
        <div className="formback1">
          <table className='unit-table'>
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
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer, index) => (
                <tr key={index}>
                  <td>{customer.customerId ? customer.customerId.toUpperCase() : ''}</td>
                  <td>
                    <Link to={`/Customer_Details/${customer._id}`}>
                      {customer.name ? customer.name.toUpperCase() : ''}
                    </Link>
                  </td>
                  <td>{customer.mobileNumber}</td>
                  <td>{customer.email || ''}</td>
                  <td>{customer.projectName}</td>
                  <td>{`${customer.blockName}-${customer.unitName}`}</td>
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
                  <td>
                    <Link to={`/Edit_Customer_Details/${customer._id}`}>Edit Details</Link>
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

export default Cancelunit;

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setPaymentDetails, setError, setLoading } from "../../Actions/Actions";
import { fetchCustomerDetails, fetchPaymentDetailsByCustomerId, fetchName, fetchUnitDetails } from "../../services/customerService";
import './Customer.css';
import Loader from "../../Confirmation/Loader";
import axios from "axios";
const CustomerDetails = () => {
  const { _id } = useParams();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.loading);
  const error = useSelector((state) => state.error);
  const paymentDetails = useSelector((state) => state.customer.paymentDetails);
  const [data, setData] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [paymentToDelete, setPaymentToDelete] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      dispatch(setLoading(true));
      try {
        if (!_id) {
          dispatch(setError("No customer ID provided."));
          return;
        }

        const matchedCustomer = await fetchCustomerDetails(_id);
        if (!matchedCustomer) {
          dispatch(setError("Customer not found."));
          return;
        }

        const [projectName, blockName, unitName, unitDetails, paymentDetailsResponse] = await Promise.all([
          fetchName("getProject", matchedCustomer.project),
          fetchName("getBlock", matchedCustomer.project, matchedCustomer.block),
          fetchName("getUnit", matchedCustomer.project, matchedCustomer.block, matchedCustomer.plotOrUnit),
          fetchUnitDetails(matchedCustomer.project, matchedCustomer.block, matchedCustomer.plotOrUnit),
          fetchPaymentDetailsByCustomerId(matchedCustomer.customerId),
        ]);

        const updatedCustomer = {
          ...matchedCustomer,
          projectName: projectName.toUpperCase(),
          blockName: blockName.toUpperCase(),
          unitName: unitName.toUpperCase(),
          paymentDetails: paymentDetailsResponse.data,
          ...unitDetails,
        };

        setData(updatedCustomer);
        dispatch({ type: "SET_CUSTOMERS", payload: [updatedCustomer] });
        dispatch(setPaymentDetails(paymentDetailsResponse.data));
      } catch (error) {
        console.error("Error fetching customer details:", error);
        dispatch(setError("Error fetching customer details. Please try again later."));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchData();
  }, [_id, dispatch]);

  const handleDeletePayment = async () => {
    if (paymentToDelete) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/paymentDetails/${paymentToDelete}`);
        const updatedPaymentDetails = paymentDetails.filter(payment => payment._id !== paymentToDelete);
        setData(prevData => ({
          ...prevData,
          paymentDetails: updatedPaymentDetails,
        }));
        dispatch(setPaymentDetails(updatedPaymentDetails));
        setShowConfirm(false);
        setPaymentToDelete(null);
      } catch (error) {
        console.error("Error deleting payment details:", error);
      }
    }
  };

  const handleShowConfirm = (paymentId) => {
    setPaymentToDelete(paymentId);
    setShowConfirm(true);
  };

  const handleCloseConfirm = () => {
    setShowConfirm(false);
    setPaymentToDelete(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return date.toLocaleDateString("en-US", options);
  };

  const total = data
    ? parseFloat(data.plotSize) * (parseFloat(data.idcCharges) + parseFloat(data.plcCharges) + parseFloat(data.edcPrice) + parseFloat(data.rate))
    : "0";

  const calculateTotalAmounts = (data) => {
    if (data && data.paymentDetails && data.paymentDetails.length > 0) {
      return data.paymentDetails.reduce((sum, payment) => sum + payment.amount, 0);
    } else {
      return 0;
    }
  };

  return (
    <div className="main-content">
      <h2 className="Headtext">Customer Details</h2>
      {loading && <div className="mt-5"><Loader /></div>}
      {error && <p>Error: {error}</p>}
      <div className="table-wrapper whiteback">
        {data && (
          <table id="firsttable">
            <thead>
              <tr>
                <th>NAME</th>
                <th>Address</th>
                <th>CONTACT NUMBER</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{data.name ? data.name.toUpperCase() : ""}</td>
                <td>{data.address ? data.address.toUpperCase() : ""}</td>
                <td>{data.mobileNumber}</td>
              </tr>
              <tr>
                <td><strong>Plot Size:</strong></td>
                <td>{data.plotSize} {data.sizeType}</td>
                <td><strong>Plot No:</strong></td>
                <td>{data.blockName}-{data.unitName}</td>
              </tr>
              <tr>
                <td><strong>Booking Date:</strong></td>
                <td>{formatDate(data.bookingDate)}</td>
                <td><strong>Basic price :</strong></td>
                <td>BSP RATE {data.rate} /-{data.sizeType} INR / {data.rate * data.plotSize}</td>
              </tr>
              <tr>
                <td><strong>IDC Charges:</strong></td>
                <td>{data.idcCharges * data.plotSize} INR / {data.idcCharges}</td>
                <td><strong>PLC Charges</strong></td>
                <td>{data.plcCharges * data.plotSize} INR / {data.plcCharges}</td>
              </tr>
              <tr>
                <td><strong>EDC Charges</strong></td>
                <td>{data.edcPrice * data.plotSize} INR / {data.edcPrice}</td>
                <td><strong>Total Consideration</strong></td>
                <td>{total}</td>
              </tr>
              <tr>
                <td><strong>Total Received Payment</strong></td>
                <td>{calculateTotalAmounts(data) || 0}</td>
                <td><strong>Balance</strong></td>
                <td>{total - calculateTotalAmounts(data) || 0}</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
      {data && (
        <div className="payment-details">
          <h3 className="Headtext mt-4">Payment Details</h3>
          <div className="whiteback">
            <table>
              <thead>
                <tr>
                  <th>Payment Type</th>
                  <th>Payment Mode</th>
                  <th>Instrument Date</th>
                  <th>Amount</th>
                  <th>Instrument No.</th>
                  <th>Status</th>
                  <th>Delete</th>
                  <th>Edit</th>
                  <th>Print</th>
                </tr>
              </thead>
              <tbody>
                {data.paymentDetails.map((payment, index) => (
                  <tr key={index}>
                    <td>
                      {["Booking", "First Installment", "Second Installment", "Third Installment", "Fourth Installment", "Fifth Installment", "Sixth Installment", "Seventh Installment", "Eighth Installment", "Possession"][payment.paymentType - 1] || "Unknown"}
                    </td>
                    <td>{payment.paymentMode}</td>
                    <td>{formatDate(payment.PaymentDate)}</td>
                    <td>{payment.amount}</td>
                    <td>{payment.reference}</td>
                    <td>Paid</td>
                    <td>
                      <img
                        src="/deletebutton.png"
                        className="delete"
                        onClick={() => handleShowConfirm(payment._id)}
                      />
                    </td>
                    <td><a href={`/edit_payment/${payment._id}`}>Edit</a></td>
                    <td><a target="_blank" href={`/print_reciept/${payment._id}`}>Print</a></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="d-flex justify-content-between mt-3">
              <div className="welcome"><a target="_blank" href={`/welcomeletter/${data._id}`}>Print Welcome letter</a></div>
              <div className="welcome"><a target="_blank" href={`/ledger/${data._id}`}>Print ledger</a></div>
              <div className="demand"><a target="_blank" href={`/print_demand_datewise/${data._id}`}>Print Demand</a></div>
            </div>
          </div>
        </div>
      )}
      {showConfirm && (
        <div className="confirm-modal">
          <div className="confirm-modal-content">
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete this payment?</p>
            <button onClick={handleDeletePayment} className="yesbutton">Yes</button>
            <button onClick={handleCloseConfirm} className="nobutton">No</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDetails;

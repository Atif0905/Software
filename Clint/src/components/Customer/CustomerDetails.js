import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setPaymentDetails } from "../../Actions/Actions";
import './Customer.css'
const CustomerDetails = () => {
  const { _id } = useParams();
  const dispatch = useDispatch();
  const customer = useSelector((state) => state.customer);
  const loading = useSelector((state) => state.loading);
  const error = useSelector((state) => state.error);
  const [data, setData] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [paymentToDelete, setPaymentToDelete] = useState(null);

  const paymentDetails = useSelector((state) => state.customer.paymentDetails);
  useEffect(() => {
    const fetchCustomerDetails = async () => {
      try {
        const customerResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/Viewcustomer`
        );
        const matchedCustomer = customerResponse.data.find(
          (c) => c._id === _id
        );
        if (matchedCustomer) {
          const projectName = await fetchName(
            "getProject",
            matchedCustomer.project
          );
          const blockName = await fetchName(
            "getBlock",
            matchedCustomer.project,
            matchedCustomer.block
          );
          const unitName = await fetchName(
            "getUnit",
            matchedCustomer.project,
            matchedCustomer.block,
            matchedCustomer.plotOrUnit
          );
          const unitDetails = await fetchUnitDetails(
            matchedCustomer.project,
            matchedCustomer.block,
            matchedCustomer.plotOrUnit
          );
          const paymentDetailsResponse = await fetchPaymentDetailsByCustomerId(
            matchedCustomer.customerId
          );
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
          dispatch({ type: "SET_CUSTOMERS", payload: [updatedCustomer] });
          dispatch(setPaymentDetails(paymentDetailsResponse.data));
        } else {
          dispatch({ type: "SET_ERROR", payload: "Customer not found." });
        }
      } catch (error) {
        console.error("Error fetching customer details:", error);
        dispatch({
          type: "SET_ERROR",
          payload: "Error fetching customer details. Please try again later.",
        });
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };
    if (_id) {
      fetchCustomerDetails();
    } else {
      dispatch({ type: "SET_ERROR", payload: "No customer ID provided." });
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [_id]);
  const fetchPaymentDetailsByCustomerId = async (customerId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/paymentDetails/${customerId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching payment details:", error);
      return { data: [] };
    }
  };
  const fetchName = async (endpoint, ...ids) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/${endpoint}/${ids.join("/")}`
      );
      return response.data.data.name;
    } catch (error) {
      console.error(`Error fetching ${endpoint} name:`, error);
      return "Unknown";
    }
  };
  const fetchUnitDetails = async (projectId, blockId, unitId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/getUnit/${projectId}/${blockId}/${unitId}`
      );
      const unitData = response.data.data;
      return {
        unitPrice: unitData.totalPrice,
        idcCharges: unitData.idcCharges,
        plcCharges: unitData.plcCharges,
        plotSize: unitData.plotSize,
        sizeType: unitData.sizeType,
        rate: unitData.rate,
        edcPrice: unitData.edcPrice,
      };
    } catch (error) {
      console.error("Error fetching unit details:", error);
      return {
        unitPrice: "Unknown",
        idcCharges: "Unknown",
        plcCharges: "Unknown",
        plotSize: "Unknown",
        sizeType: "Unknown",
        rate: "unknown",
        edcPrice: "unknown",
      };
    }
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return date.toLocaleDateString("en-US", options);
  };
  const total = data
    ? parseFloat(data.plotSize) *
      (parseFloat(data.idcCharges) +
        parseFloat(data.plcCharges) +
        parseFloat(data.edcPrice) +
        parseFloat(data.rate))
    : "0";
    const calculateTotalAmounts = (data) => {
      if (data && data.paymentDetails && data.paymentDetails.length > 0) {
        return data.paymentDetails.reduce(
          (sum, payment) => sum + payment.amount,
          0
        );
      } else {
        return 0;
      }
    };
 const handleDeletePayment = async () => {
    if (paymentToDelete) {
      try {
        await axios.delete(
          `${process.env.REACT_APP_API_URL}/paymentDetails/${paymentToDelete}`
        );
        const updatedPaymentDetails = paymentDetails.filter(
          (payment) => payment._id !== paymentToDelete
        );
        setData((prevData) => ({
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
  return (
    <div className="main-content">
      <h2 className="Headtext">Customer List</h2>
      <div className="table-wrapper whiteback">
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        {data && (
          <table id="firsttable">
            <tr>
              <th>NAME</th>
              <th>Address</th>
              <th>CONTACT NUMBER</th>
            </tr>
            <tbody>
              <tr>
                <td>{data.name ? data.name.toUpperCase() : ""}</td>
                <td>{data.address ? data.address.toUpperCase() : ""}</td>
                <td>{data.mobileNumber}</td>
              </tr>
              <tr>
                <td>
                  <strong>Plot Size:</strong>
                </td>
                <td>
                  {data.plotSize} {data.sizeType}
                </td>
                <td>
                  <strong>Plot No:</strong>
                </td>
                <td>
                  {data.blockName}-{data.unitName}
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Booking Date:</strong>
                </td>
                <td>{formatDate(data.bookingDate)}</td>
                <td>
                  <strong>Basic price :</strong>
                </td>
                <td>
                  {" "}
                  BSP RATE {data.rate} /-{data.sizeType} INR /{" "}
                  {data.rate * data.plotSize}
                </td>
              </tr>
              <tr>
                <td>
                  <strong>IDC Charges:</strong>{" "}
                </td>
                <td>
                  {data.idcCharges * data.plotSize} INR / {data.idcCharges}
                </td>
                <td>
                  <strong>PLC Charges</strong>
                </td>
                <td>
                  {data.plcCharges * data.plotSize} INR / {data.plcCharges}
                </td>
              </tr>
              <tr>
                <td>
                  <strong>EDC Charges</strong>
                </td>
                <td>
                  {data.edcPrice * data.plotSize} INR / {data.edcPrice}
                </td>
                <td>
                  <strong>Total Consideration</strong>
                </td>
                <td>{total}</td>
              </tr>
              <tr>
                <td>
                  <strong>Total Received Payment</strong>
                </td>
                <td>{calculateTotalAmounts(data) || 0}</td>
                <td>
                  <strong>Balance</strong>
                </td>
                <td>{total - calculateTotalAmounts(data) || 0}</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
      {paymentDetails && (
        <div className="payment-details ">
          <h3 className="mt-4">Payment Details</h3>
          <div className="whiteback">
            <div>
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
            {paymentDetails.map((payment, index) => (
                <tr key={index}>
                  <td>
                    {payment.paymentType == 1
                      ? "Booking"
                      : payment.paymentType == 2
                      ? "First Installment"
                      : payment.paymentType == 3
                      ? "Second Installment"
                      : payment.paymentType == 4
                      ? "Third Installment"
                      : payment.paymentType == 5
                      ? "Fourth Installment"
                      : payment.paymentType == 6
                      ? "Fifth Installment"
                      : payment.paymentType == 7
                      ? "Sixth Installment"
                      : payment.paymentType == 8
                      ? "Seventh Installment"
                      : payment.paymentType == 9
                      ? "Eighth Installment"
                      : "Possession"}
                  </td>
                  <td>{payment.paymentMode}</td>
                  <td>{formatDate(payment.PaymentDate)}</td>
                  <td>{payment.amount}</td>
                  <td>{payment.reference}</td>
                  <td>Paid</td>
                  <td><img src="/deletebutton.png" className="delete "
                        onClick={() => handleShowConfirm(payment._id)}
                      /></td>
                  <td><a href={`/edit_payment/${payment._id}`}>Edit</a></td>
                  <td><a href={`/print_reciept/${payment._id}`}>Print</a></td>
                </tr>
              ))}
            </tbody>
          </table>
          {data &&  (
          <div className="d-flex justify-content-between mt-3">
          <div className="welcome"> <a href={`/welcomeletter/${data._id}`}>Print Welcome letter</a></div>
            <div className="demand"> <a href={`/print_demand_datewise/${data._id}`}>Print Demand</a></div>
            </div>
          )}
          </div>
          </div>
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
          <div>
          </div>
        </div>
      )}
    </div>
  );
};
export default CustomerDetails;
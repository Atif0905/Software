import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios';
import ConfirmationModal from "../Confirmation/ConfirmationModal";
import Loader from "../Confirmation/Loader";
const Edit_Payment = () => {
  const { _id } = useParams();
  const [error, setError] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState({
    paymentMode: "",
    amount: "",
    reference: "",
    comment: "",
    PaymentDate: "",
    customerId: ""
  });
  const [showConfirm, setShowConfirm] = useState(false);
  useEffect(() => {
    const fetchPaymentAndCustomerDetails = async (_id) => {
      try {
        const paymentResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/paymentDetails`
        );
        if (
          paymentResponse.data &&
          paymentResponse.data.data &&
          Array.isArray(paymentResponse.data.data)
        ) {
          const paymentIndex = paymentResponse.data.data.findIndex(
            (payment) => payment._id.toString() === _id.toString()
          );
          if (paymentIndex !== -1) {
            const paymentDetail = paymentResponse.data.data[paymentIndex];
            paymentDetail.PaymentDate = new Date(paymentDetail.PaymentDate).toISOString().split('T')[0];
            setPaymentDetails(paymentDetail);
          } else {
            setError("Payment details not found");
          }
        } else {
          setError("Invalid payment response structure");
        }
      } catch (error) {
        console.error("Error fetching payment details:", error);
        setError("Failed to fetch payment details");
      }
    };

    fetchPaymentAndCustomerDetails(_id);
  }, [_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/paymentDetails/${_id}`,
        paymentDetails
      );
      if (response.status === 200) {
      } else {
        alert("Failed to update payment details");
      }
    } catch (error) {
      console.error("Error updating payment details:", error);
      setError("Failed to update payment details");
    }
  };
  const handleSubmit1 = (e) => {
    e.preventDefault();
    setShowConfirm(true);
  };
  return (
    <div className="main-content">
      {error && <p className="error">{error}</p>}
      {paymentDetails ? (
        <div className="row">
          <div className="col-7">
            <div className="formback">
              <h4 className="formhead">Edit Details </h4>
              <div className="p-3">
              <form onSubmit={handleSubmit1}>
                <div>
                  <label>Payment Mode:</label>
                  <select
                    className="select-buttons ps-1"
                    name="paymentMode"
                    value={paymentDetails.paymentMode}
                    onChange={handleChange}
                  >
                    <option>Select</option>
                    <option>cheque</option>
                    <option>cash</option>
                    <option>Bank Deposit</option>
                    <option>Bank Transfer</option>
                    <option>Online</option>
                    <option>commission Adjustment</option>
                  </select>
                </div>
                <div>
                  <label>Amount:</label>
                  <input
                    className="form-input-field"
                    type="number"
                    name="amount"
                    value={paymentDetails.amount}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label>Reference:</label>
                  <input
                    type="text"
                    className="form-input-field"
                    name="reference"
                    value={paymentDetails.reference}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label>Customer Id</label>
                  <input
                    className="select-buttons ps-1"
                    type="text"
                    name="CustomerId"
                    value={paymentDetails.customerId}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label>Comment:</label>
                  <input
                    name="comment"
                    className="form-input-field"
                    value={paymentDetails.comment}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label>Payment Date:</label>
                  <input
                    type="date"
                    className="form-input-field"
                    name="PaymentDate"
                    value={paymentDetails.PaymentDate}
                    onChange={handleChange}
                  />
                </div>
                <div className="center"><button type="submit" className="addbutton mt-3">Update </button></div>
                <ConfirmationModal
            show={showConfirm}
            onClose={() => setShowConfirm(false)}
            onConfirm={() => {
              setShowConfirm(false);
              handleSubmit();
            }}
            message="Are you sure you Edit These details"
          />
              </form>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p><Loader/></p>
      )}
    </div>
  );
};

export default Edit_Payment;

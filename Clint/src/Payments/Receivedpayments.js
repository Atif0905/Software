import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Payments.css";

const Receivedpayments = () => {
  const [aadharNumber, setAadharNumber] = useState('');
  const [customerDetails, setCustomerDetails] = useState(null);
  const [error, setError] = useState(null);
  const [yourAadharNumber, setYourAadharNumber] = useState('');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [submittedInstallments, setSubmittedInstallments] = useState([]);

  const [payment, setPayment] = useState({
    paymentType: '',
    paymentMode: '',
    amount: '',
    reference: '',
    comment: '',
    PaymentDate: '',
  });
  const [paymentPlans, setPaymentPlans] = useState([]);
  const [selectedPlanInstallments, setSelectedPlanInstallments] = useState([]);
  const [installmentInputs, setInstallmentInputs] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayment({ ...payment, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('form submit successfully');
    try {
      if (aadharNumber !== yourAadharNumber) {
        setError('Entered Aadhar number does not match the searched Aadhar number');
        return;
      }
      console.log('Form Data:', {
        paymentType: payment.paymentType,
        paymentMode: payment.paymentMode,
        amount: payment.amount,
        reference: payment.reference,
        comment: payment.comment,
        aadharNumber: yourAadharNumber,
        PaymentDate: payment.PaymentDate
      });
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/paymentDetails`, {
        paymentType: payment.paymentType,
        paymentMode: payment.paymentMode,
        amount: payment.amount,
        reference: payment.reference,
        comment: payment.comment,
        aadharNumber: yourAadharNumber,
        PaymentDate: payment.PaymentDate
      });
      setInstallmentInputs({ ...installmentInputs, [payment.paymentType]: payment });
      setPayment({
        paymentType: '',
        paymentMode: '',
        amount: '',
        reference: '',
        comment: '',
        PaymentDate: ''
      });
      setError(null);
    } catch (error) {
      console.error('Error submitting payment:', error);
      setError('Error submitting payment. Please try again later.'); // Set error message for display
    }
  };
  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/paymentDetails`);
        console.log(response  )
        // Assuming the response data is an array of payment details
        const installmentInputs = {};
        response.data.forEach(installment => {
          installmentInputs[installment.installment] = {
            PaymentDate: installment.PaymentDate,
            amount: installment.amount
          };
        });
        setInstallmentInputs(installmentInputs);
      } catch (error) {
        console.error('Error fetching payment details:', error);
      }
    };

    fetchPaymentDetails();
  }, []);
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/Viewcustomer`
        );
        setCustomerDetails(response.data);
      } catch (error) {
        console.error("Error fetching customers:", error);
        setError("Error fetching customers. Please try again later.");
      }
    };
    fetchCustomers();
  }, []);

  useEffect(() => {
    const fetchPaymentPlans = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/paymentPlans`);
        if (Array.isArray(response.data.paymentPlans)) {
          setPaymentPlans(response.data.paymentPlans);
        } else {
          console.error('Invalid data format for payment plans:', response.data);
        }
      } catch (error) {
        console.error('Error fetching payment plans:', error);
      }
    };
    fetchPaymentPlans();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!aadharNumber) {
      setError('Please enter a valid Aadhar number');
      return;
    }
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/viewcustomer/${aadharNumber}`);
      setCustomerDetails(response.data);
      if (response.data.paymentPlan) {
        const matchedPlan = paymentPlans.find(plan => plan.planName === response.data.paymentPlan);
        if (matchedPlan) {
          setSelectedPlanInstallments(matchedPlan.installments);
        } else {
          setSelectedPlanInstallments([]);
        }
      }
      setError(null);
    } catch (error) {
      setError('Customer not found');
      setCustomerDetails(null);
    }
  };

  const handleMakePayment = () => {
    setShowPaymentForm(true);
  };

  return (
    <div className="main-content">
      <h4 className="Headtext">Receive Payment from Customer</h4>
      <div className="d-flex">
        <form onSubmit={handleSearch}>
          <div className="col-8">
            <div className="whiteback">
              <label className="mt-3">Customer Aadhar Number</label>
              <input
                className="form-input-field"
                type="text"
                placeholder="Enter Customer Aadhar Number"
                value={aadharNumber}
                onChange={(e) => setAadharNumber(e.target.value)}
              />
              <button className="add-buttons mt-3" type="submit">
                Search
              </button>
            </div>
          </div>
        </form>
        {error && <p>{error}</p>}
        {customerDetails && (
          <div className="col-8 whiteback">
            <div className="table-wrapper">
              <table className="fl-table d-flex">
                <thead>
                  <tr>
                    <th>Name</th>
                  </tr>
                  <tr>
                    <th>Father/Husband Name</th>
                  </tr>
                  <tr>
                    <th>Address</th>
                  </tr>
                  <tr>
                    <th>Aadhar Number</th>
                  </tr>
                  <tr>
                    <th>Pan Number</th>
                  </tr>
                  <tr>
                    <th>Mobile Number</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{customerDetails.name}</td>
                  </tr>
                  <tr>
                    <td>{customerDetails.fatherOrHusbandName}</td>
                  </tr>
                  <tr>
                    <td>{customerDetails.address}</td>
                  </tr>
                  <tr>
                    <td>{customerDetails.aadharNumber}</td>
                  </tr>
                  <tr>
                    <td>{customerDetails.panNumber}</td>
                  </tr>
                  <tr>
                    <td>{customerDetails.mobileNumber}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <h4 className="Headtext1" onClick={handleMakePayment}>
              <span className="makepayment">Make Payment</span>
            </h4>
          </div>
        )}
      </div>
      {showPaymentForm && (
        <div>
          <h4 className="Headtext">Post Payment of customers</h4>
          <h4 className="Headtext1">
            Name: {customerDetails.name}, Aadhar Number:{" "}
            {customerDetails.aadharNumber} , Phone Number :{" "}
            {customerDetails.mobileNumber}
          </h4>
          <div className="d-flex justify-content-between">
            <div className="col-3 whiteback mt-4">
              <form onSubmit={handleSubmit}>
              <label>Select Payment Mode</label>
              <select
  className="select-buttons ps-1"
  name="paymentType"
  value={payment.paymentType}
  onChange={handleChange}
>
  <option>Select</option>
  {selectedPlanInstallments.map((installment, index) => (
    !submittedInstallments.includes(installment.installment) && (
      <option key={index} value={installment.installment}>
        {installment.installment} - {installment.dueDate} -{" "}
        {installment.amount}
      </option>
    )
  ))}
</select>
                <label>Select Payment Mode</label>
                <select
                  className="select-buttons ps-1"
                  name="paymentMode"
                  value={payment.paymentMode}
                  onChange={handleChange}
                >
                  <option>Select</option>
                  <option>cheque</option>
                  <option>cash</option>
                  <option>Bank Deposit</option>
                  <option>Bank Transfer</option>
                  <option>Online</option>
                  <option>commision Adjustment</option>
                </select>
                <label>Amount</label>
                <input
                  type="number"
                  className="form-input-field"
                  name="amount"
                  value={payment.amount}
                  onChange={handleChange}
                />
                <label>Cheque/ Receipt/ No.</label>
                <input
                  type="text"
                  className="form-input-field"
                  name="reference"
                  value={payment.reference}
                  onChange={handleChange}
                />
                <label>Payment Date</label>
                <input
                  type="date"
                  className="form-input-field"
                  name="PaymentDate"
                  value={payment.PaymentDate}
                  onChange={handleChange}
                />
                <label>Aadhar Number</label>
                <input
                  required
                  className="form-input-field"
                  type="text"
                  placeholder="Enter Your Aadhar Number"
                  value={yourAadharNumber}
                  onChange={(e) => setYourAadharNumber(e.target.value)}
                />
                <label>Comment</label>
                <input
                  type="text"
                  className="form-input-field"
                  name="comment"
                  placeholder="Enter comment regarding payment"
                  value={payment.comment}
                  onChange={handleChange}
                />
                <button type="submit" className="btn btn-primary mt-3">
                  Submit
                </button>
              </form>
            </div>
            <div className="col-8 mt-4">
              <div className="whiteback">
                <h2 className="head">
                  Total Due Till date : {customerDetails.totalPrice}
                </h2>
                <h4 className="Headtext1">Payment Plan Installments</h4>
                <table>
                  <thead>
                    <tr>
                      <th>Installment</th>
                      <th>Due Date</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedPlanInstallments.map((installment, index) => (
                      <tr key={index}>
                        <td>{installment.installment} Installment</td>
                        <td>
                          {installmentInputs[installment.installment]?.PaymentDate || ""}
                        </td>
                        <td>
                          {installmentInputs[installment.installment]?.amount || ""}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Receivedpayments;

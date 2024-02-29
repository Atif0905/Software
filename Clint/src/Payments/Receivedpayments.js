import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Payments.css";

const Receivedpayments = () => {
  const [customerId, setCustomerId] = useState('');
  const [customerDetails, setCustomerDetails] = useState(null);
  const [error, setError] = useState(null);
  const [yourCustomerId, setYourCustomerId] = useState('');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [submittedInstallments, setSubmittedInstallments] = useState([]);
  const [matchedPayments, setMatchedPayments] = useState([]);

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
  const [disabledInstallments, setDisabledInstallments] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayment({ ...payment, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('form submit successfully');
    try {
      if (customerId !== yourCustomerId) {
        setError('Entered Customer ID does not match the searched Customer ID');
        return;
      }
      console.log('Form Data:', {
        paymentType: payment.paymentType,
        paymentMode: payment.paymentMode,
        amount: payment.amount,
        reference: payment.reference,
        comment: payment.comment,
        customerId: yourCustomerId,
        PaymentDate: payment.PaymentDate
      });
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/paymentDetails`, {
        paymentType: payment.paymentType,
        paymentMode: payment.paymentMode,
        amount: payment.amount,
        reference: payment.reference,
        comment: payment.comment,
        customerId: yourCustomerId,
        PaymentDate: payment.PaymentDate
      });
      setSubmittedInstallments([...submittedInstallments, payment.paymentType]);
      setDisabledInstallments([...disabledInstallments, payment.paymentType]); // Disable selected installment
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

  // Function to fetch payment details based on Customer ID
  const fetchPaymentDetailsByCustomerId = async (customerId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/paymentDetails/${customerId}`);
      return response.data.data; // Assuming 'data' contains the array of payments
    } catch (error) {
      console.error('Error fetching payment details:', error);
      throw new Error('Error fetching payment details. Please try again later.');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const paymentDetails = await fetchPaymentDetailsByCustomerId(customerId);
        setMatchedPayments(paymentDetails); // Set matched payments in state
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, [customerId]);

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
          const filteredPlans = response.data.paymentPlans.map(plan => {
            const filteredInstallments = plan.installments.filter(installment => !installment.rendered);
            return { ...plan, installments: filteredInstallments };
          });
          setPaymentPlans(filteredPlans);
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
    if (!customerId) {
      setError('Please enter a valid Customer ID');
      return;
    }
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/viewcustomer/${customerId}`);
      setCustomerDetails(response.data);
      if (response.data.paymentPlan) {
        const matchedPlan = paymentPlans.find(plan => plan.planName === response.data.paymentPlan);
        if (matchedPlan) {
          setSelectedPlanInstallments(matchedPlan.installments);
          const disabledInstallments = matchedPlan.installments
            .filter(installment => submittedInstallments.includes(installment.installment))
            .map(installment => installment.installment);
          setDisabledInstallments(disabledInstallments);
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
              <label className="mt-3">Customer ID</label>
              <input
                className="form-input-field"
                type="text"
                placeholder="Enter Customer ID"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
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
                    <th>Customer ID</th>
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
                    <td>{customerDetails.customerId}</td>
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
            Name: {customerDetails.name}, Customer ID:{" "}
            {customerDetails.customerId} , Phone Number :{" "}
            {customerDetails.mobileNumber}
          </h4>
          <div className="d-flex justify-content-between">
            <div className="col-3 whiteback mt-4">
              <form onSubmit={handleSubmit}>
                <label>Select Installments</label>
                <select
                  className="select-buttons ps-1"
                  name="paymentType"
                  value={payment.paymentType}
                  onChange={handleChange}
                >
                  <option>Select</option>
                  {selectedPlanInstallments.map((installment, index) => (
                    !submittedInstallments.includes(installment.installment) && (
                      <option
                        key={index}
                        value={installment.installment}
                        disabled={disabledInstallments.includes(installment.installment)}
                      >
                        {installment.installment}{installment.dueDate}
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
                <label>Customer ID</label>
                <input
                  required
                  className="form-input-field"
                  type="text"
                  placeholder="Enter Your Customer ID"
                  value={yourCustomerId}
                  onChange={(e) => setYourCustomerId(e.target.value)}
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
                    {matchedPayments.map((payment, index) => (
                      <tr key={index}>
                        <td>{payment.paymentType}</td>
                        <td>{payment.PaymentDate}</td>
                        <td>{payment.amount}</td>
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

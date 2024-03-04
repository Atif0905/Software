import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Payments.css";

const Receivedpayments = () => {
  const [customerId, setCustomerId] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [customerDetails, setCustomerDetails] = useState(null);
  const [error, setError] = useState(null);
  const [yourCustomerId, setYourCustomerId] = useState('');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [submittedInstallments, setSubmittedInstallments] = useState([]);
  const [matchedPayments, setMatchedPayments] = useState([]);
  const [selectedPlanInstallments, setSelectedPlanInstallments] = useState([]);
  const [disabledInstallments, setDisabledInstallments] = useState([]);
  const [paymentPlans, setPaymentPlans] = useState([]);
  const [showCustomerDetails, setShowCustomerDetails] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPaymentClicked, setIsPaymentClicked] = useState(false);
  const [unitData, setUnitData] = useState(null);
  const [payment, setPayment] = useState({
    paymentType: '',
    paymentMode: '',
    amount: '',
    reference: '',
    comment: '',
    PaymentDate: '',
  });

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
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/paymentDetails`,{
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
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/Viewcustomer`);
        const customersWithDetails = await Promise.all(response.data.map(async (customer) => {
          const projectName = await fetchName('getProject', customer.project);
          const blockName = await fetchName('getBlock', customer.project, customer.block);
          const unitName = await fetchName('getUnit', customer.project, customer.block, customer.plotOrUnit);
          const unitDetails = await fetchUnitDetails(customer.project, customer.block, customer.plotOrUnit);
          return {
            ...customer,
            projectName: projectName.toUpperCase(),
            blockName: blockName.toUpperCase(),
            unitName: unitName.toUpperCase(),
            ...unitDetails,
          };
        }));
        setCustomers(customersWithDetails);
      } catch (error) {
        console.error('Error fetching customers:', error);
        setError('Error fetching customers. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);
  
  const fetchUnitDetails = async (projectId, blockId, unitId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/getUnit/${projectId}/${blockId}/${unitId}`);
      const unitData = response.data.data;
      console.log('Unit Data:', unitData);
      return unitData; // Return unit data
    } catch (error) {
      console.error('Error fetching unit details:', error);
      return null; // Return null in case of error
    }
  };
  

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
      console.log('Fetched customer details:', response.data);
      const customerDetails = response.data;
  
      // Fetch unit details based on customer data
      const unitDetails = await fetchUnitDetails(customerDetails.project, customerDetails.block, customerDetails.plotOrUnit);
  
      // Check if unitDetails is an array and has data
      if (Array.isArray(unitDetails) && unitDetails.length > 0) {
        // Check if any unit details match the customer's plotOrUnit ID
        const matchedUnit = unitDetails.find(unit => unit.id === customerDetails.plotOrUnit);
        if (matchedUnit) {
          console.log('Matched unit details:', matchedUnit); // Log the matched unit details
          // Set the matched unit details into a separate constant
          const customerUnitDetails = {
            unitPrice: matchedUnit.unitPrice,
            idcCharges: matchedUnit.idcCharges,
            plcCharges: matchedUnit.plcCharges,
            plotSize: matchedUnit.plotSize,
            sizeType: matchedUnit.sizeType,
            rate: matchedUnit.rate,
            // Include any other unit details you need
          };
          setCustomerDetails({ ...customerDetails, unitDetails: customerUnitDetails });
          setUnitData(matchedUnit); // Set the unitData state here
          // Additional code if needed
          return; // Stop the function execution here
        } else {
          console.log('No matching unit found');
        }
      } 
      // If no unit is matched, continue with the rest of the code
      setCustomerDetails(customerDetails);
      setUnitData(null); // Set unitData to null if no unit is matched
  
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
      setShowCustomerDetails(true); // Show customer details after search
      setSelectedCustomerId(customerId); // Set selected customer ID
    } catch (error) {
      console.error('Error fetching customer details:', error);
      setError('Customer not found');
      setCustomerDetails(null);
    }
  };
  
  const handleMakePayment = () => {
    setIsPaymentClicked(true);
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return date.toLocaleDateString('en-US', options);
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

  const handleViewDetails = (customerDetails) => {
    setSelectedCustomer(customerDetails);
  };
  useEffect(() => {
    const fetchUnitDetails = async (projectId, blockId, unitId) => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/getUnit/${projectId}/${blockId}/${unitId}`);
        const unitData = response.data.data;
        console.log('Unit Data:', unitData);
        return unitData; // Return unit data
      } catch (error) {
        console.error('Error fetching unit details:', error);
        return null; // Return null in case of error
      }
    };
  
    fetchUnitDetails();
  }, [customerDetails]);
  
  const filteredPayments = matchedPayments.filter(payment => payment.customerId === selectedCustomerId);
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
                value={customerId.toUpperCase()}
                onChange={(e) => setCustomerId(e.target.value)}
              />
              <button className="add-buttons mt-3" type="submit">
                Search
              </button>
            </div>
          </div>
        </form>
        {showCustomerDetails && error && <p>{error}</p>}
        {showCustomerDetails && customerDetails && (
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
              <span className="makepayment">Make a Payment</span>
            </h4>
          </div>
        )}
      </div>
      {!isPaymentClicked && error && <p>{error}</p>}
        {isPaymentClicked && customerDetails &&   (
        <div>
          <h4 className="Headtext">Post Payment of customers</h4>
          <h4 className="Headtext1">
            Name: {customerDetails.name}, Customer ID:{" "}
            {customerDetails.customerId} , Phone Number :{" "}
            {customerDetails.mobileNumber} , unitPrice : {customerDetails.unitDetails?.unitPrice || '-'}
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
                  value={yourCustomerId.toUpperCase()}
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
                  {filteredPayments.map((payment, index) => (
                      <tr key={index}>
                        <td>{payment.paymentType}</td>
                        <td>{formatDate(payment.PaymentDate)}</td>
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
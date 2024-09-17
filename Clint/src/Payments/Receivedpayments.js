import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Payments.css";
import ConfirmationModal from "../Confirmation/ConfirmationModal";
const Receivedpayments = () => {
  const [customerId, setCustomerId] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [customerDetails, setCustomerDetails] = useState(null);
  const [error, setError] = useState(null);
  const [yourCustomerId, setYourCustomerId] = useState("");
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
  const [showConfirm, setShowConfirm] = useState(false); 
  const [payment, setPayment] = useState({
    paymentType: "",
    paymentMode: "",
    amount: "",
    reference: "",
    comment: "",
    PaymentDate: "",
    // amounttoberecieved: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayment({ ...payment, [name]: value });
  };
  const handleSubmit = async (e) => {
    console.log("form submit successfully");
    try {
      if (customerId !== yourCustomerId) {
        setError("Entered Customer ID does not match the searched Customer ID");
        return;
      }
      
      console.log("Form Data:", {
        paymentType: payment.paymentType,
        paymentMode: payment.paymentMode,
        amount: payment.amount,
        reference: payment.reference,
        comment: payment.comment,
        customerId: yourCustomerId,
        PaymentDate: payment.PaymentDate,
        amounttoberecieved: payment.amounttoberecieved,
      });
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/paymentDetails`,
        {
          paymentType: payment.paymentType,
          paymentMode: payment.paymentMode,
          amount: payment.amount,
          reference: payment.reference,
          comment: payment.comment,
          customerId: yourCustomerId,
          PaymentDate: payment.PaymentDate,
          // amounttoberecieved: payment.amounttoberecieved,
        }
      );
      setSubmittedInstallments([...submittedInstallments, payment.paymentType]);
      setDisabledInstallments([...disabledInstallments, payment.paymentType]);
      setPayment({
        paymentType: "",
        paymentMode: "",
        amount: "",
        reference: "",
        comment: "",
        PaymentDate: "",
        // amounttoberecieved: "",
      });
      
      setError(null);
    } catch (error) {
      console.error("Error submitting payment:", error);
      setError("Error submitting payment. Please try again later.");
    }
  };
  const fetchPaymentDetailsByCustomerId = async (customerId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/paymentDetails/${customerId}`
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching payment details:", error);
      throw new Error(
        // "Error fetching payment details. Please try again later."
      );
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const paymentDetails = await fetchPaymentDetailsByCustomerId(
          customerId
        );
        setMatchedPayments(paymentDetails);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, [customerId]);
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
         const response = await axios.get(`${process.env.REACT_APP_API_URL}/customer`);
        const customersWithDetails = await Promise.all(
          response.data.map(async (customer) => {
            const projectName = await fetchName("getProject", customer.project);
            const blockName = await fetchName(
              "getBlock",
              customer.project,
              customer.block
            );
            const unitName = await fetchName(
              "getUnit", 
              customer.project, customer.block, customer.plotOrUnit
            );
            const unitDetails = await fetchUnitDetails(
              customer.project,customer.block,customer.plotOrUnit
            );
            return {
              ...customer, projectName: projectName.toUpperCase(), blockName: blockName.toUpperCase(), unitName: unitName.toUpperCase(),
              ...unitDetails,
            };
          })
        );
        setCustomers(customersWithDetails);
      } catch (error) {
        console.error("Error fetching customers:", error);
        setError("Error fetching customers. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);
  const fetchUnitDetails = async (projectId, blockId, unitId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/getUnit/${projectId}/${blockId}/${unitId}`
      );
      const unitData = response.data.data;
      return unitData;
    } catch (error) {
      console.error("Error fetching unit details:", error);
      return null;
    }
  };
  useEffect(() => {
    const fetchPaymentPlans = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/paymentPlans`
        );
        console.log(response)
        if (Array.isArray(response.data.paymentPlans)) {
          const modifiedPlans = response.data.paymentPlans.map(async (plan) => {
            const modifiedInstallments = await Promise.all(
              plan.installments.map(async (installment) => {
                try {
                  const installmentResponse = await axios.get(
                    `${process.env.REACT_APP_API_URL}/installmentDetails/${installment._id}`
                  );
                  return {
                    ...installment,
                    amountRs: installmentResponse.data.amountRS,
                  };
                } catch (error) {
                  console.error("Error fetching installment details:", error);
                  return installment;
                }
              })
            );
            return { ...plan, installments: modifiedInstallments };
          });
          const filteredPlans = await Promise.all(modifiedPlans);
          setPaymentPlans(filteredPlans);
        } else {
          console.error(
            "Invalid data format for payment plans:",
            response.data
          );
        }
      } catch (error) {
        console.error("Error fetching payment plans:", error);
      }
    };
    fetchPaymentPlans();
  }, []);
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!customerId) {
      setError("Please enter a valid Customer ID");
      return;
    }
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/customer/${customerId}`
      );
      console.log("Fetched customer details:", response.data);
      const customerDetails = response.data;
      const unitDetails = await fetchUnitDetails(
        customerDetails.project,
        customerDetails.block,
        customerDetails.plotOrUnit
      );
      console.log(unitDetails)
      if (Array.isArray(unitDetails) && unitDetails.length > 0) {
        const matchedUnit = unitDetails.find(
          (unit) => unit.id === customerDetails.plotOrUnit
        );
        if (matchedUnit) {
          const customerUnitDetails = {
            unitPrice: matchedUnit.unitPrice,
            idcCharges: matchedUnit.idcCharges,
            plcCharges: matchedUnit.plcCharges,
            plotSize: matchedUnit.plotSize,
            sizeType: matchedUnit.sizeType,
            rate: matchedUnit.rate,
            edcPrice: matchedUnit.edcPrice,
          };
          setCustomerDetails({
            ...customerDetails,
            unitDetails: customerUnitDetails,
          });
          setUnitData(matchedUnit);
        } else {
          setCustomerDetails(customerDetails);
          setUnitData(null);
        }
      } else {
        setCustomerDetails(customerDetails);
        setUnitData(null);
      }
  
      let installmentDueDates = [];
      if (response.data.paymentPlan) {
        const matchedPlan = paymentPlans.find(
          (plan) => plan.planName === response.data.paymentPlan
        );
  
        if (matchedPlan) {
          setSelectedPlanInstallments(matchedPlan.installments);
          const totalInstallments = matchedPlan.numInstallments;
          const tenureDays = customerDetails.Tenuredays;
          const installmentInterval = tenureDays / totalInstallments;
  
          installmentDueDates = matchedPlan.installments.map((installment, index) => {
            const dueDate = new Date();
            dueDate.setDate(dueDate.getDate() + installmentInterval * (index + 1));
            
            // Calculate the amount for this specific installment
            const amount = (parseFloat(installment.amountRS) / 100) * 
                           (parseFloat(unitDetails.plotSize) * parseFloat(unitDetails.rate));
            
            return {
              installment: installment.installment,
              dueDate: dueDate.toISOString().split('T')[0],
              amount: amount,
            };
          });
  
          const disabledInstallments = matchedPlan.installments
            .filter((installment) =>
              submittedInstallments.includes(installment.installment)
            )
            .map((installment) => installment.installment);
          setDisabledInstallments(disabledInstallments);
        } else {
          setSelectedPlanInstallments([]);
        }
      }
      setCustomerDetails((prevDetails) => ({
        ...prevDetails,
        Duedates: installmentDueDates,
      }));
      for (let dueDate of installmentDueDates) {
        try {
          await axios.post(`${process.env.REACT_APP_API_URL}/DueDate`, {
            dueDate: dueDate.dueDate,
            installment: dueDate.installment,
            amount: dueDate.amount,
            customerId: customerId
          });
        } catch (error) {
          if (error.response && error.response.status === 409) {
            console.log(`Duplicate entry for installment ${dueDate.installment} on ${dueDate.dueDate}`);
          } else {
            console.error(`Error storing installment ${dueDate.installment} on ${dueDate.dueDate}:`, error);
          }
        }
      }
  
      setError(null);
      setShowCustomerDetails(true);
      setSelectedCustomerId(customerId);
  
    } catch (error) {
      console.error("Error fetching customer details:", error);
      setError("Customer not found");
      setCustomerDetails(null);
    }
  };
  
  
  const handleViewDetails = (customerDetails) => {
    setSelectedCustomer(customerDetails);
  };
  
  const handleMakePayment = async () => {
    setIsPaymentClicked(true);
    try {
      const response = await fetchUnitDetails(
        customerDetails.project,
        customerDetails.block,
        customerDetails.plotOrUnit
      );
      setUnitData(response); 
    } catch (error) {
      console.error("Error making payment:", error);
    }
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return date.toLocaleDateString("en-US", options);
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
  useEffect(() => {
    const fetchUnitDetails = async (projectId, blockId, unitId) => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/getUnit/${projectId}/${blockId}/${unitId}`
        );
        const unitData = response.data.data;
        return unitData;
      } catch (error) {
        console.error("Error fetching unit details:", error);
        return null;
      }
    };
    fetchUnitDetails();
  }, [customerDetails]);
  const filteredPayments = matchedPayments.filter(
    (payment) => payment.customerId === selectedCustomerId
  );
  let totalDue = unitData && unitData.totalPrice ? unitData.totalPrice : 0;
  filteredPayments.forEach((payment) => {
    totalDue -= parseFloat(payment.amount);
  });
  function ordinalSuffix(number) {
    const suffixes = ["th", "st", "nd", "rd"];
    const v = number % 100;
    return number + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
  }
  const possessionCharges = unitData
    ? (
        (parseFloat(unitData.idcCharges) +
          parseFloat(unitData.plcCharges) +
          parseFloat(unitData.edcPrice)) *
        parseFloat(unitData.plotSize)
      ).toFixed(2)
    : "";
    const handleSubmit1 = (e) => {
      e.preventDefault();
      setShowConfirm(true);
    };
  return (
    <div className="main-content">
      <div className="row ">
      <div className="col-4">
        <form onSubmit={handleSearch}>
          <div className="formback1">
          <label className="formhead ">Customer ID</label>
            <div className="p-3">
              
              <input className="form-input-field" type="text" placeholder="Enter Customer ID" value={customerId.toUpperCase()} onChange={(e) => setCustomerId(e.target.value)}/>
              <div className="center"><button className="addbutton mt-3" type="submit">   {" "}  Search{" "}  </button></div>
            </div>
          </div>          
        </form>
        </div>
        <div className="col-8">
        {showCustomerDetails && customerDetails && (
          <div className="formback1">
            <h3 className="formhead">Customer Details</h3>
            <div className="table-wrapper p-3">
              <table className="fl-table d-flex">
                <thead>
                  <tr><th>Name</th></tr>
                  <tr><th>Father/Husband Name</th></tr> 
                  <tr><th>Address</th></tr>
                  <tr><th>Customer ID</th></tr>
                  <tr><th>Pan Number</th></tr>
                  <tr><th>Mobile Number</th></tr>
                </thead>
                <tbody>
                  <tr><td>{customerDetails.name.toUpperCase()}</td></tr>
                  <tr><td>{customerDetails.fatherOrHusbandName.toUpperCase()}</td></tr>
                  <tr><td>{customerDetails.address.toUpperCase()}</td></tr>
                  <tr><td>{customerDetails.customerId}</td></tr>
                  <tr><td>{customerDetails.panNumber.toUpperCase()}</td></tr>
                  <tr><td>{customerDetails.mobileNumber}</td></tr>
                </tbody>
              </table>
              <div className="center"><button className="addbutton" onClick={handleMakePayment}> Add Payment </button></div>
            </div>
            </div>
        )}
        </div>
      </div>
      {!isPaymentClicked && error && <p>{error}</p>}
      {isPaymentClicked && customerDetails && unitData && (
        <div>
          <div className="formback2 mt-3">
          <h4 className="formheadcenter">Post Payment of customers</h4>
            <div className="p-2">
          
          <h4 className="Headtext1">
            Name: {customerDetails.name.toUpperCase()}, Customer ID:{" "}
            {customerDetails.customerId} , Phone Number :{" "}
            {customerDetails.mobileNumber} , unitPrice : {unitData.totalPrice}
          </h4>
          </div>
          </div>
          <div className="row">
            <div className="col-4 mt-4">
              <div className="formback1">
                <h3 className="formhead">New Payment</h3>
                <div className="p-3">
              <form onSubmit={handleSubmit1}>
                <label>Select Installments</label>
                <select
                  className="select-buttons ps-1"
                  name="paymentType"
                  value={payment.paymentType}
                  onChange={handleChange}
                >
                  <option>Select</option>
                  {selectedPlanInstallments.map(
                    (installment, index) =>
                      !submittedInstallments.includes(
                        installment.installment
                      ) &&
                      installment.installment !== payment.paymentType && (
                        <option
                          key={index}
                          value={installment.installment}
                          disabled={
                            disabledInstallments.includes(
                              installment.installment
                            ) || installment.installment === payment.paymentType
                          }
                        >
                          {index === 0
                            ? "Booking"
                            : `${ordinalSuffix(index)} Installment`}{" "}
                          -{" "}
                          {(parseFloat(installment.amountRS) / 100) *
                            (parseFloat(unitData.plotSize) *
                              parseFloat(unitData.rate))}
                        </option>
                      )
                  )}
                  {!submittedInstallments.includes("Possession Charges") && (
                    <option
                      disabled={payment.paymentType === "Possession Charges"}
                    >
                      Possession Charges - {possessionCharges}
                    </option>
                  )}
                </select>

                <label>Select Payment Mode</label>
                <select className="select-buttons ps-1" name="paymentMode" value={payment.paymentMode} onChange={handleChange} >
                  <option>Select</option>
                  <option>cheque</option>
                  <option>cash</option>
                  <option>Bank Deposit</option>
                  <option>Bank Transfer</option>
                  <option>Online</option>
                  <option>commision Adjustment</option>
                </select>
                <label>Amount</label>
                <input type="number" className="form-input-field" name="amount" value={payment.amount} onChange={handleChange} />
                <label>Cheque/ Receipt/ No.</label>
                <input type="text" className="form-input-field" name="reference" value={payment.reference} onChange={handleChange} />
                <label>Payment Date</label>
                <input type="date" className="form-input-field" name="PaymentDate" value={payment.PaymentDate} onChange={handleChange} />
                <label>Customer ID</label>
                <input required className="form-input-field" type="text" placeholder="Enter Your Customer ID" value={yourCustomerId.toUpperCase()} onChange={(e) => setYourCustomerId(e.target.value)} />
                <label>Comment</label>
                <input type="text" className="form-input-field" name="comment" placeholder="Enter comment regarding payment" value={payment.comment} onChange={handleChange} />
                <div className="center"><button type="submit" className="addbutton mt-3">
                  Submit
                </button></div>
                <ConfirmationModal
            show={showConfirm}
            onClose={() => setShowConfirm(false)}
            onConfirm={() => {
              setShowConfirm(false);
              handleSubmit();
            }}
            message="Are you sure you want to add this block?"
          />
              </form>
              </div>
              </div>
            </div>
            <div className="col-8 mt-4">
              <div className="formback1">
                <h2 className="formhead">Payment Plan Installments</h2>
                <div className='formtablehead1 d-flex justify-content-between'>
                <th>Installment</th>
                <th>Due Date</th>
                <th>Amount</th>
                </div>
                    {filteredPayments.map((payment, index) => (
                      <div className='formtabletext d-flex justify-content-between' key={index}>
                        <td>
                          {payment.paymentType.startsWith("Possession Charges")
                            ? "Possession Charges"
                            : isNaN(payment.paymentType)
                            ? payment.paymentType
                            : payment.paymentType === "1"
                            ? "Booking"
                            : payment.paymentType === "2"
                            ? "1st Installment"
                            : payment.paymentType === "3"
                            ? "2nd Installment"
                            : payment.paymentType === "4"
                            ? "3rd Installment"
                            : parseInt(payment.paymentType) -
                              1 +
                              ordinalSuffix(parseInt(payment.paymentType) - 1) +
                              " Installment"}
                        </td>

                        <td>{formatDate(payment.PaymentDate)}</td>
                        <td>{payment.amount}</td>
                      </div>
                    ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Receivedpayments;
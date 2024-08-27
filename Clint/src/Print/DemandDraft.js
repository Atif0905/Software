import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import './Print.css';
import Loader from "../Confirmation/Loader";

const DemandDraft = () => {
  const { _id } = useParams();
  const [paymentDetails, setPaymentDetails] = useState([]);
  const [customerDetails, setCustomerDetails] = useState(null);
  const [payment , setPayment] = useState(null);
  const [projects, setProjects] = useState([]);
  const [projectdetails, setProjectdetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjectsAndCustomer = async () => {
      setLoading(true);
      try {
        const projectsResponse = await axios.get(`${process.env.REACT_APP_API_URL}/getallProjects`);
        const projectsData = projectsResponse.data.data || [];
        setProjects(projectsData);
        const customerResponse = await axios.get(`${process.env.REACT_APP_API_URL}/Viewcustomer`);
        const customerData = customerResponse.data;
        const Paymentresponse = await axios.get(`${process.env.REACT_APP_API_URL}/paymentDetails`);
        const PaymentData = Paymentresponse.data.data || [];
        setPayment(PaymentData)
        const foundCustomer = customerData.find(customer => customer._id === _id);
        setCustomerDetails(foundCustomer);
        const matchedProject = projectsData.find(project => project._id === foundCustomer.project);
        setProjectdetails(matchedProject || {});
        const MatchedPayment = PaymentData.filter(payment => payment.customerId === foundCustomer.customerId)
        setPaymentDetails(MatchedPayment || {});
        const projectName = await fetchName("getProject", foundCustomer.project);
        const blockName = await fetchName("getBlock", foundCustomer.project, foundCustomer.block);
        const unitName = await fetchName("getUnit", foundCustomer.project, foundCustomer.block, foundCustomer.plotOrUnit);
        const unitDetails = await fetchUnitDetails(foundCustomer.project, foundCustomer.block, foundCustomer.plotOrUnit);
        const paymentDetailsResponse = await fetchPaymentDetailsByCustomerId(foundCustomer.customerId);
        const updatedCustomer = {
          ...foundCustomer,
          projectName: projectName.toUpperCase(),
          blockName: blockName.toUpperCase(),
          unitName: unitName.toUpperCase(),
          paymentDetails: paymentDetailsResponse.data,
          ...unitDetails,
        };
        setCustomerDetails(updatedCustomer);

        setLoading(false);
      } catch (error) {
        setError("Error fetching data");
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchProjectsAndCustomer();
  }, [_id]);

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
        rate: "Unknown",
        edcPrice: "Unknown",
      };
    }
  };

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

  const total = customerDetails
    ? parseFloat(customerDetails.plotSize) *
      (parseFloat(customerDetails.idcCharges) +
        parseFloat(customerDetails.plcCharges) +
        parseFloat(customerDetails.edcPrice) +
        parseFloat(customerDetails.rate))
    : "0";

  const calculateTotalAmounts = (customerDetails) => {
    if (customerDetails && customerDetails.paymentDetails && customerDetails.paymentDetails.length > 0) {
      return customerDetails.paymentDetails.reduce(
        (sum, payment) => sum + payment.amount,
        0
      );
    } else {
      return 0;
    }
  };

  if (loading) {
    return <div><Loader/></div>;
  }
  var date = new Date;
  var Year =  date.getFullYear();
  var month = String(date.getMonth() +1).padStart(2, '0');
  var todaydate = String(date.getDate()).padStart(2, '0');
  var datepattern = todaydate + '-' + month + '-' + Year ;

  return (
    <div className="container last mt-5">
      <h4 className="text-center mt-3">DUE AMOUNT INTIMATION</h4>
      <div className="mt-5">
        {customerDetails && projectdetails && (
          <div>
            <div className="row">
              <div className="col-6">
                <h6>{customerDetails.title} {customerDetails.name.toUpperCase()}</h6>
                <h6 className="mt-5">{customerDetails.address}</h6>
                <h6>Area: {customerDetails.plotSize}</h6>
                <h6>Rate: {customerDetails.rate}</h6>
              </div>
              <div className="col-6">
                <h6>Demand date:  {datepattern}</h6>
                <h6>GSTIN NO: {projectdetails.GST}</h6>
                <h6>Project Name: {customerDetails.projectName}</h6>
                <h6>Unit No {customerDetails.blockName}-{customerDetails.unitName}</h6>
                <h6>Email Id: {customerDetails.email}</h6>
                <h6>Mobile No: {customerDetails.mobileNumber}</h6>
              </div>
            </div>
            <div>
              <h6 className="text-center mt-4">
                SUBJECT: Payment Dues For the {customerDetails.propertyType} in {projectdetails.name} {projectdetails.description}
              </h6>
              <p className="mt-4">
                Dear Sir/Madam,<br />
                With reference to your booking of above-mentioned Unit/Plot the following amount is Due as per our Records.
              </p>
            </div>
            {paymentDetails.length > 0 && (
              <table id="demand">
                <thead>
                  <tr>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                  </tr>
                  <tr>
                    <th>S.No</th>
                    <th>Particular</th>
                    <th>Due Date</th>
                    <th>Interest</th>
                    <th>Total amount</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentDetails.map((payment, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        {payment.paymentType === 1
                          ? "Booking"
                          : payment.paymentType === 2
                          ? "First Installment"
                          : payment.paymentType === 3
                          ? "Second Installment"
                          : payment.paymentType === 4
                          ? "Third Installment"
                          : payment.paymentType === 5
                          ? "Fourth Installment"
                          : payment.paymentType === 6
                          ? "Fifth Installment"
                          : payment.paymentType === 7
                          ? "Sixth Installment"
                          : payment.paymentType === 8
                          ? "Seventh Installment"
                          : payment.paymentType === 9
                          ? "Eighth Installment"
                          : "Possession"}
                      </td>
                      <td>{payment.dueDate}</td>
                      <td>{0}</td>
                      <td>{payment.amount}</td>
                    </tr>
                  ))}
                  <tr>
                    <td></td>
                    <td><strong>Total Receivable Amount</strong></td>
                    <td></td>
                    <td>{0}</td>
                    <td>{total}</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td><strong>Total Received Amount</strong></td>
                    <td></td>
                    <td>{0}</td>
                    <td>{total - calculateTotalAmounts(customerDetails) || 0}</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td><strong>Total Outstanding Amount</strong></td>
                    <td></td>
                    <td>{0}</td>
                    <td>{calculateTotalAmounts(customerDetails) || 0}</td>
                  </tr>
                  <tr>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                  </tr>
                </tbody>
              </table>
            )}
            <p className="mt-3">*GST as applicable will be charged extra.</p>
            <p>
              You are requested to kindly clear above mentioned dues by demand/ Draft/ RTGS drawn in favour of <strong> “Womeki Investors Club Private Limited" A/c No. -{projectdetails.AccountNo}, BANK- {projectdetails.Bank},  IFSC-{projectdetails.IFSC} payable at {projectdetails.Payable}</strong> at the earliest to avoid further levy the interest charges.
            </p>
            <p>Interest for all delayed payments will be charged at the rate & on term strictly in accordance to duly executed Agreement</p>
            <p className="mt-5">We thank you for your understanding and cooperation.<br/>Thanking you & assuring you of our best Services always.</p>
            <div className="text-center">
              <p><strong>From Womeki Investors Club Private Limited</strong></p>
              <p><strong>Authorised Signatory</strong></p>
            </div>
            <p>*** This is system generated and doesn't require any signature.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DemandDraft;

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./Print.css";
import Loader from "../Confirmation/Loader";
const Print_reciept = () => {
  const { _id } = useParams();
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [customerDetails, setCustomerDetails] = useState(null);
  const [paymentIndex, setPaymentIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projects, setProjects] = useState([]);
  const [projectdetails, setProjectdetails] = useState(null);
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
  useEffect(() => {
    const fetchCustomerDetails = async (customerId) => {
      try {
        const projectsResponse = await axios.get(`${process.env.REACT_APP_API_URL}/getallProjects`);
        const projectsData = projectsResponse.data.data || [];
        setProjects(projectsData);
        const customerResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/Viewcustomer/${customerId}`
        );
        if (customerResponse.data) {
          const matchedCustomer = customerResponse.data;
          const matchedProject = projectsData.find(project => project._id === matchedCustomer.project);
        setProjectdetails(matchedProject || {});
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
          setCustomerDetails(updatedCustomer);
          setLoading(false); 
        } else {
          setError("Invalid customer response structure");
          console.error(
            "Invalid customer response structure:",
            customerResponse.data
          );
        }
      } catch (error) {
        console.error("Error fetching customer details:", error);
        setError("Failed to fetch customer details");
      }
    };
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
              setPaymentDetails(paymentDetail);
              setPaymentIndex(paymentIndex);
              await fetchCustomerDetails(paymentDetail.customerId);
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
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: "numeric", day: "2-digit", month: "2-digit" };
    return date.toLocaleDateString("en-US", options);
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
    <div className="Printcontainer">
      <div className="printarea1">
        <div className="printarea2">
          <p className="ReceiptHead">Payment Details</p>
        </div>
        <div className="printarea3">
          <div className="printarea4">
            {customerDetails && paymentDetails && projectdetails &&(
              <div>
                <h5>Receipt No : {paymentIndex + 1}</h5>
                <h5>Customer ID : {customerDetails.customerId}</h5>
                <p>{customerDetails.name.toUpperCase()}</p>
                <p className="mt-5">Address: {customerDetails.address}</p>
              </div>
            )}
          </div>
          <div className="printarea4">
            <h6>Customer Copy</h6>
            <p>
              Womeki Investors Club Private Limited 25 floor, Tower B, Bhutani
              Alphathum Sector-90, Noida, 201305.
              <br />
              GSTIN: 09AADCW1980H1Z2
            </p>
            <p>{datepattern}</p>
          </div>
        </div>
        <div className="printarea4">
          {customerDetails && (
            <div>
              <p className="mt-3">
                A Payment in respect of residential{" "}
                {customerDetails.propertyType}{" "}
                <span>
                  {customerDetails.unitName} - {customerDetails.blockName}{" "}
                  {customerDetails.plotSize} {customerDetails.sizeType} (approx) at
                  "{customerDetails.projectName} {projectdetails.description}"
                </span>
              </p>
            </div>
          )}
        </div>
        <div className="printarea4">
          {paymentDetails && (
            <table >
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Mode</th>
                  <th>Instrument Date</th>
                  <th>Instrument No</th>
                  <th>Total Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>{paymentDetails.paymentMode}</td>
                  <td>{formatDate(paymentDetails.PaymentDate)}</td>
                  <td>{paymentDetails.reference}</td>
                  <td>{paymentDetails.amount}</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
        <div className="printarea4">
          <h4 className="mt-4">Terms & Conditions</h4>
          <ul>
            <li>This Receipt is valid subject to realization of cheque/DD/RTGS</li>
            <li>The amount received is inclusive of service tax/ GST as applicable</li>
            <li>Acceptance of this payment won't guarantee transfer of ownership of unit final payment is received</li>
            <li>This receipt is subject to realization of cheque / draft</li>
          </ul>
          <h5>For Womeki Investors Club Private Limited</h5>
          <h6 className="signarea">Authorised Signatory</h6>
        </div>
      </div>
    </div>
  );
};
export default Print_reciept;
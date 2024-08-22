import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import './Print.css';
const Ledger = () => {
    const { _id } = useParams();
    const [paymentDetails, setPaymentDetails] = useState([]);
    const [customerDetails, setCustomerDetails] = useState(null);
    const [payment , setPayment] = useState(null);
    const [projects, setProjects] = useState([]);
    const [projectdetails, setProjectdetails] = useState(null);
    const [date, setDate] = useState(new Date());
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
            console.log(foundCustomer)
            const matchedProject = projectsData.find(project => project._id === foundCustomer.project);
            console.log(matchedProject)
            setProjectdetails(matchedProject || {});
            const MatchedPayment = PaymentData.filter(payment => payment.customerId === foundCustomer.customerId)
            setPaymentDetails(MatchedPayment || {});
            console.log(MatchedPayment)
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
      if (loading) {
        return <div>Loading...</div>;
      }
      const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { year: "numeric", month: "2-digit", day: "2-digit" };
        return date.toLocaleDateString("en-US", options);
      };
  return (
    <div className="container ">
        {customerDetails && projectdetails && (
            <div>
        <h6 className='text-center mt-5'>APPLICANT FILE</h6>
        <div className='d-flex justify-content-between'>
        <h6>Customer Id: {customerDetails.customerId}</h6>
        <h6 className='right'>Date: {date.toDateString()}</h6></div>
        <div className="ledgerarea">
            <div className="printarea5"> First Apllicant </div>
            <div className="printarea5"> Co Apllicant </div>
            <div className="printarea5">
            <div className="ledgerarea">
                <p>Name:</p> <p>{customerDetails.name.toUpperCase()}</p>
                <p>Present Address:</p> <p>{customerDetails.address}</p>
                <p>Permanent Address: </p><p>{customerDetails.permanentaddress}</p>
                <p>Contact No:</p> <p>{customerDetails.mobileNumber}</p>
                <p>Email Id:</p> <p>{customerDetails.email}</p>
                <p>Pan Number:</p><p>{customerDetails.panNumber}</p>
                <p>Adhar No:</p><p>{customerDetails.aadharNumber}</p>
                <p>Date Of Birth:</p><p>{formatDate(customerDetails.DOB)}</p>
            </div>
            </div>
            <div className="printarea5">
            <div className="ledgerarea">
                <p>Name:</p> <p>{customerDetails.name2.toUpperCase()}</p>
                <p>Present Address:</p> <p>{customerDetails.address2}</p>
                <p>Contact No:</p> <p>{customerDetails.mobileNumber2}</p>
                <p>Pan Number:</p><p>{customerDetails.panNumber2}</p>
                <p>Adhar No:</p><p>{customerDetails.aadharNumber2}</p>
                <p>Date Of Birth:</p><p>{formatDate(customerDetails.DOB2)}</p>
            </div>
            </div>
            <div className="printarea5">
            <div className="ledgerarea">
                <p>Project:</p> <p>{projectdetails.name.toUpperCase()}</p>
                <p>Block:</p> <p>{customerDetails.blockName}</p>
                <p>Unit No:</p> <p>{customerDetails.unitName}</p>
                <p>unit Type:</p> <p>{customerDetails.sizeType}</p>
                <p>Location:</p><p>{projectdetails.description}</p>
            </div>
            </div>
            <div className="printarea5">
            <div className="ledgerarea">
                <p>Project:</p> <p>{customerDetails.paymentPlan}</p>
                <p>Employee Name:</p> <p>{customerDetails.EmployeeName}</p>
                <p>Booking Created By:</p> <p>{customerDetails.CreatedBy}</p>
            </div>
            </div>
            <div className="printarea5">
            <div className="ledgerarea">
                <p>Super Area ({customerDetails.sizeType}):</p> <p>{customerDetails.plotSize}</p>
                <p>Rate (Rs/{customerDetails.sizeType})</p> <p>{customerDetails.rate}</p>
                <h6 className="mt-3">Net Basic Price(Rs {customerDetails.rate}/{customerDetails.sizeType})</h6> <h6 className="d-flex justify-content-end mt-3">{customerDetails.rate * customerDetails.plotSize}</h6>
            </div>
            <h6 className="mt-3">Add:</h6>
            <div className="ledgerarea">
                <p>PLC ( Rs):</p> <p>{customerDetails.plcCharges * customerDetails.plotSize}</p>
                <p>Other Charges (Rs)</p> <p>{(customerDetails.idcCharges * customerDetails.plotSize ) + (customerDetails.edcPrice * customerDetails.plotSize )}</p>
            </div>
            <p className="d-flex justify-content-end ">{(customerDetails.plcCharges * customerDetails.plotSize) + ((customerDetails.idcCharges * customerDetails.plotSize ) + (customerDetails.edcPrice * customerDetails.plotSize ))}</p>
            
            <p className="d-flex justify-content-end ">{total}</p>
            </div>
        </div>
        </div>
        )}
    </div>
  )
}

export default Ledger
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  fetchName,
  fetchUnitDetails,
  fetchPaymentDetailsByCustomerId,
  fetchProjects,
  fetchCustomerDetailsById,
  fetchPaymentDetails,
} from "../services/customerService";
import Loader from "../Confirmation/Loader";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import "./Print.css";

const Print_reciept = () => {
  const { _id } = useParams();
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [customerDetails, setCustomerDetails] = useState(null);
  const [paymentIndex, setPaymentIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projects, setProjects] = useState([]);
  const [projectdetails, setProjectdetails] = useState(null);
  useEffect(() => {
    const fetchCustomerAndProjectDetails = async (customerId) => {
      try {
        const projectsData = await fetchProjects();
        setProjects(projectsData);
        const customerData = await fetchCustomerDetailsById(customerId);
        if (customerData) {
          const matchedProject = projectsData.find(project => project._id === customerData.project);
          setProjectdetails(matchedProject || {});
          const projectName = await fetchName("getProject", customerData.project);
          const blockName = await fetchName("getBlock", customerData.project, customerData.block);
          const unitName = await fetchName("getUnit", customerData.project, customerData.block, customerData.plotOrUnit);
          const unitDetails = await fetchUnitDetails(customerData.project, customerData.block, customerData.plotOrUnit);
          const paymentDetailsData = await fetchPaymentDetailsByCustomerId(customerData.customerId);
          const updatedCustomer = {
            ...customerData,
            projectName: projectName.toUpperCase(),
            blockName: blockName.toUpperCase(),
            unitName: unitName.toUpperCase(),
            paymentDetails: paymentDetailsData.data,
            ...unitDetails,
          };
          setCustomerDetails(updatedCustomer);
          setLoading(false);
        } else {
          setError("Invalid customer response structure");
        }
      } catch (error) {
        console.error("Error fetching customer and project details:", error);
        setError("Failed to fetch customer and project details");
      }
    };
    const fetchPaymentAndCustomerDetails = async (_id) => {
      try {
        const paymentData = await fetchPaymentDetails();
        const paymentIndex = paymentData.findIndex((payment) => payment._id.toString() === _id.toString());
        if (paymentIndex !== -1) {
          const paymentDetail = paymentData[paymentIndex];
          setPaymentDetails(paymentDetail);
          setPaymentIndex(paymentIndex);
          await fetchCustomerAndProjectDetails(paymentDetail.customerId);
        } else {
          setError("Payment details not found");
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
    return date.toLocaleDateString("en-US", { year: "numeric", day: "2-digit", month: "2-digit" });
  };
  if (loading) return <Loader />;
  const handlePrint = () => {
    window.print();
  };
  var date = new Date;
  var Year =  date.getFullYear();
  var month = String(date.getMonth() +1).padStart(2, '0');
  var todaydate = String(date.getDate()).padStart(2, '0');
  var datepattern = todaydate + '-' + month + '-' + Year ;
  const handleDownloadPDF = async () => {
    const input = document.getElementById('print-content');
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save('Print-receipt.pdf');
  };
  return (
    <div className="Printcontainer">
      <div className='button-group d-flex justify-content-end mt-5'>
        <button onClick={handlePrint} className='print-button'>Print</button>
        <button className="Download" onClick={handleDownloadPDF}>
          <svg className="svgIcon" viewBox="0 0 384 512" height="1em" xmlns="http://www.w3.org/2000/svg">
            <path d="M169.4 470.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 370.8 224 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 306.7L54.6 265.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"></path>
          </svg>
          <span className="icon2"></span>
        </button>
      </div>
      <div className="printarea1" id='print-content'>
        <div className="printarea2">
          <p className="ReceiptHead" >Payment Details</p>
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
             Test 25 floor, Tower B, Bhutani
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
          <h5>For Test</h5>
          <h6 className="signarea">Authorised Signatory</h6>
        </div>
      </div>
    </div>
  );
};
export default Print_reciept;
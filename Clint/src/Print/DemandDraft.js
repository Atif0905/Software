import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {  fetchProjects,  fetchCustomers,  fetchPaymentDetails,  fetchName,  fetchUnitDetails,  fetchPaymentDetailsByCustomerId} from '../services/customerService'; 
import "./Print.css";
import Loader from "../Confirmation/Loader";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const DemandDraft = () => {
  const { _id } = useParams();
  const [paymentDetails, setPaymentDetails] = useState([]);
  const [customerDetails, setCustomerDetails] = useState(null);
  const [payment, setPayment] = useState(null);
  const [projects, setProjects] = useState([]);
  const [projectdetails, setProjectdetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjectsAndCustomer = async () => {
      setLoading(true);
      try {
        const [projectsData, customerData, paymentData] = await Promise.all([
          fetchProjects(),
          fetchCustomers(),
          fetchPaymentDetails(),
        ]);
        
        setProjects(projectsData);
        setPayment(paymentData);

        const foundCustomer = customerData.find((customer) => customer._id === _id);
        if (foundCustomer) {
          setCustomerDetails(foundCustomer);
          const matchedProject = projectsData.find((project) => project._id === foundCustomer.project);
          setProjectdetails(matchedProject || {});

          const [projectName, blockName, unitName, unitDetails, paymentDetailsResponse] = await Promise.all([
            fetchName("getProject", foundCustomer.project),
            fetchName("getBlock", foundCustomer.project, foundCustomer.block),
            fetchName("getUnit", foundCustomer.project, foundCustomer.block, foundCustomer.plotOrUnit),
            fetchUnitDetails(foundCustomer.project, foundCustomer.block, foundCustomer.plotOrUnit),
            fetchPaymentDetailsByCustomerId(foundCustomer.customerId),
          ]);

          const updatedCustomer = {
            ...foundCustomer,
            projectName: projectName.toUpperCase(),
            blockName: blockName.toUpperCase(),
            unitName: unitName.toUpperCase(),
            paymentDetails: paymentDetailsResponse.data,
            ...unitDetails,
          };
          setCustomerDetails(updatedCustomer);
          setPaymentDetails(updatedCustomer.paymentDetails || []);
        }

        setLoading(false);
      } catch (error) {
        setError("Error fetching data");
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchProjectsAndCustomer();
  }, [_id]);

  const total = customerDetails
    ? parseFloat(customerDetails.plotSize) *
      (parseFloat(customerDetails.idcCharges) +
        parseFloat(customerDetails.plcCharges) +
        parseFloat(customerDetails.edcPrice) +
        parseFloat(customerDetails.rate))
    : "0";

  const calculateTotalAmounts = (customerDetails) => {
    if (
      customerDetails &&
      customerDetails.paymentDetails &&
      customerDetails.paymentDetails.length > 0
    ) {
      return customerDetails.paymentDetails.reduce(
        (sum, payment) => sum + payment.amount,
        0
      );
    }
    return 0;
  };

  if (loading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  const date = new Date();
  const datepattern = `${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()}`;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    const input = document.getElementById("print-content");
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    const imgWidth = 210; // A4 size width in mm
    const pageHeight = 295; // A4 size height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, -heightLeft, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    pdf.save("Demand-draft.pdf");
  };
  return (
    <div className="white">
    <div id='print-content'>
            <div className='button-group d-flex justify-content-end mt-5'>
        <button onClick={handlePrint} className='print-button'>Print</button>
        <button className="Download" onClick={handleDownloadPDF}>
          <svg className="svgIcon" viewBox="0 0 384 512" height="1em" xmlns="http://www.w3.org/2000/svg">
            <path d="M169.4 470.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 370.8 224 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 306.7L54.6 265.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"></path>
          </svg>
          <span className="icon2"></span>
        </button>
      </div>
    <div className="container last mt-5">
      <div  >
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
    </div>
    </div>
    </div>
  );
};

export default DemandDraft;

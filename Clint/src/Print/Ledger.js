import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Loader from "../Confirmation/Loader";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
  fetchProjects,
  fetchCustomers,
  fetchPaymentDetails,
  fetchName,
  fetchUnitDetails,
  fetchPaymentDetailsByCustomerId,
} from '../services/customerService'; // Adjust the path as necessary

const Ledger = () => {
    const { _id } = useParams();
    const [paymentDetails, setPaymentDetails] = useState([]);
    const [customerDetails, setCustomerDetails] = useState(null);
    const [payment, setPayment] = useState(null);
    const [projects, setProjects] = useState([]);
    const [projectdetails, setProjectdetails] = useState(null);
    const [date] = useState(new Date());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const projectsData = await fetchProjects();
                setProjects(projectsData);
                const customerData = await fetchCustomers();
                const paymentData = await fetchPaymentDetails();
                setPayment(paymentData);

                const foundCustomer = customerData.find(customer => customer._id === _id);
                setCustomerDetails(foundCustomer);
                const matchedProject = projectsData.find(project => project._id === foundCustomer.project);
                setProjectdetails(matchedProject || {});

                const matchedPayment = paymentData.filter(payment => payment.customerId === foundCustomer.customerId);
                setPaymentDetails(matchedPayment || []);
                
                // Fetch additional details
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

        fetchData();
    }, [_id]);

    const total = customerDetails
        ? parseFloat(customerDetails.plotSize) *
          (parseFloat(customerDetails.idcCharges) +
            parseFloat(customerDetails.plcCharges) +
            parseFloat(customerDetails.edcPrice) +
            parseFloat(customerDetails.rate))
        : "0";

    if (loading) {
        return <div><Loader /></div>;
    }
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const options = { year: "numeric", month: "2-digit", day: "2-digit" };
      return date.toLocaleDateString("en-US", options);
    };
    const handlePrint = () => {
        window.print();
    };

    const handleDownloadPDF = async () => {
        const input = document.getElementById('print-content');
        const canvas = await html2canvas(input);
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgWidth = 210; // A4 size width in mm
        const pageHeight = 295; // A4 size height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;

        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, -heightLeft, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }
        pdf.save('Ledger.pdf');
    };
    const totalwithoutdevcharges = ((total - total * (customerDetails.discount / 100)) - 
        ((parseFloat(customerDetails.edcPrice) + parseFloat(customerDetails.idcCharges) + parseFloat(customerDetails.plcCharges)) * parseFloat(customerDetails.plotSize))
      );
  return (
    <div className="white">
    <div className="container ">
      <div className='button-group d-flex justify-content-end mt-5'>
        <button onClick={handlePrint} className='print-button'>Print</button>
        <button className="Download" onClick={handleDownloadPDF}>
          <svg className="svgIcon" viewBox="0 0 384 512" height="1em" xmlns="http://www.w3.org/2000/svg">
            <path d="M169.4 470.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 370.8 224 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 306.7L54.6 265.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"></path>
          </svg>
          <span className="icon2"></span>
        </button>
      </div>
        {customerDetails && projectdetails && (
            <div id='print-content' >
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
                <h6 className="mt-3">Net Basic Price(Rs {customerDetails.rate}/{customerDetails.sizeType})</h6> <h6 className="d-flex justify-content-end mt-3">{totalwithoutdevcharges}</h6>
            </div>
            <h6 className="mt-3">Add:</h6>
            <div className="ledgerarea">
                <p>PLC ( Rs):</p> <p>{customerDetails.plcCharges * customerDetails.plotSize}</p>
                <p>Other Charges (Rs)</p> <p>{(customerDetails.idcCharges * customerDetails.plotSize ) + (customerDetails.edcPrice * customerDetails.plotSize )}</p>
            </div>
            <p className="d-flex justify-content-end ">{(customerDetails.plcCharges * customerDetails.plotSize) + ((customerDetails.idcCharges * customerDetails.plotSize ) + (customerDetails.edcPrice * customerDetails.plotSize ))}</p>
            
            <p className="d-flex justify-content-end ">{total - (total * (customerDetails.discount/100))}</p>
            </div>
        </div>
        </div>
        )}
    </div>
    </div>
  )
}

export default Ledger
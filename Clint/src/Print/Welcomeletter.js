import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Loader from "../Confirmation/Loader";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { fetchProjects, fetchCustomers, fetchName, fetchUnitDetails} from '../services/customerService';
const Welcomeletter = () => {
    const { _id } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [customerDetails, setCustomerDetails] = useState(null);
    const [projectdetails, setProjectdetails] = useState(null);
    const [date] = useState(new Date());
    useEffect(() => {
        const fetchProjectsAndCustomer = async () => {
            setLoading(true);
            try {
                const projectsData = await fetchProjects();
                const customerData = await fetchCustomers();
                const foundCustomer = customerData.find(customer => customer._id === _id);
                setCustomerDetails(foundCustomer);
                const matchedProject = projectsData.find(project => project._id === foundCustomer.project);
                setProjectdetails(matchedProject || {});
                const projectName = await fetchName("getProject", foundCustomer.project);
                const blockName = await fetchName("getBlock", foundCustomer.project, foundCustomer.block);
                const unitName = await fetchName("getUnit", foundCustomer.project, foundCustomer.block, foundCustomer.plotOrUnit);
                const unitDetails = await fetchUnitDetails(foundCustomer.project, foundCustomer.block, foundCustomer.plotOrUnit);
                const updatedCustomer = {
                    ...foundCustomer,
                    projectName: projectName.toUpperCase(),
                    blockName: blockName.toUpperCase(),
                    unitName: unitName.toUpperCase(),
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
    if (loading) {
        return <div><Loader /></div>;
    }
    const handlePrint = () => {
        window.print();
    };
    const handleDownloadPDF = async () => {
        const input = document.getElementById('print-content');
        const canvas = await html2canvas(input);
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgWidth = 210; 
        const pageHeight = 295; 
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        while (heightLeft >= 0) {
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, -heightLeft, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }
        pdf.save('Welcomeletter.pdf');
    };
  return (
    <div className="white p-3">
    <div className="container ">
      <div className='button-group d-flex justify-content-end'>
        <button onClick={handlePrint} className='print-button'>Print</button>
        <button className="Download" onClick={handleDownloadPDF}>
          <svg className="svgIcon" viewBox="0 0 384 512" height="1em" xmlns="http://www.w3.org/2000/svg">
            <path d="M169.4 470.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 370.8 224 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 306.7L54.6 265.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"></path>
          </svg>
          <span className="icon2"></span>
        </button>
      </div>
      <div id='print-content' >
      <h3 className="welcomehead" >WELCOME LETTER</h3>
      <div>
      {customerDetails && projectdetails && (
        <div className="row mt-5">
          <div className="col-6">
          <h6>Dear {customerDetails.title} {customerDetails.name.toUpperCase()} </h6>
          <p>Address: {customerDetails.address.toUpperCase()}</p>
          <p>{customerDetails.propertyType} No : {customerDetails.unitName}</p>
          <p>Area: {customerDetails.plotSize} {customerDetails.sizeType}</p>
        </div>
        <div className="col-6">
          <h6 className="right">Demand Date: {date.toDateString()}</h6>
        </div>
        </div>
      )}
      </div>
      {customerDetails && projectdetails && (
        <div>
          <div> <h5 className="text-center">SUBJECT: Welcome to Project {projectdetails.name} </h5></div>
        <h6 className="mt-5">Dear Sir/ Madam,</h6>
        <p>We are delighted to extend our warmest greetings and welcome you to Project <span>“{projectdetails.name.toUpperCase()}”</span>, nestled in the serene surroundings of Jaloon tehsil, Dantaram Garh, district Sikar, Rajasthan! Thank you for choosing to invest in a plot within our prestigious project and entrusting us with your dream of owning property in our township. We are committed to ensuring your journey with us is nothing short of exceptional.</p>
        <p>At Project <span>“{projectdetails.name.toUpperCase()}”</span>, we take immense pride in offering best-in-class services and amenities to our valued customers. As part of our steadfast commitment to providing exceptional customer service, we pledge to keep you informed about all developments in the project and stand by your side every step of the way.</p>
        <p>Our team of dedicated experts is committed to delivering a seamless and hassle-free experience throughout your project journey. We understand that investing in property is a significant decision, and it is our goal to make this experience memorable and fulfilling for you.</p>
        <p>Once again, thank you for choosing us as your partner on this exciting journey. We eagerly look forward to creating a beautiful and enriching experience for you and your family.</p>
        <h6>If you have any inquiries regarding this matter, please do not hesitate to contact us.</h6>
        <p>Best regards,</p>
        <h5 className="mt-3">{projectdetails.CompanyName}</h5>
        </div>
      )}
      </div>
      </div>
      </div>
  )
}
export default Welcomeletter
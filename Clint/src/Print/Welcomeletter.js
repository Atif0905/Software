import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./Print.css"
const Welcomeletter = () => {
    const { _id } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [customerDetails, setCustomerDetails] = useState(null);
    const [projectdetails, setProjectdetails] = useState(null);
    const [date, setDate] = useState(new Date());
    useEffect(() => {
      const fetchProjectsAndCustomer = async () => {
        setLoading(true);
        try {
          const projectsResponse = await axios.get(`${process.env.REACT_APP_API_URL}/getallProjects`);
          const projectsData = projectsResponse.data.data || [];
          const customerResponse = await axios.get(`${process.env.REACT_APP_API_URL}/Viewcustomer`);
          const customerData = customerResponse.data;
          const foundCustomer = customerData.find(customer => customer._id === _id);
          setCustomerDetails(foundCustomer);
          console.log(foundCustomer)
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
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h3 className="welcomehead">WELCOME LETTER</h3>
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
  )
}

export default Welcomeletter
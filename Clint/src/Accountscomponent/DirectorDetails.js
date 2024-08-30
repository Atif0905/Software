import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setPaymentDetails } from "../Actions/Actions";
import '../components/Customer/Customer.css';
import Loader from "../Confirmation/Loader";
const Loading = () => (
  <div className="loading-spinner">
    <Loader/>
  </div>
);
const DirectorDetails = () => {
  const { _id } = useParams();
  const dispatch = useDispatch();
  const [data, setData] = useState(null); 
  const [teamLeadNames, setTeamLeadNames] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchCustomerDetails = async () => {
      try {
        const customerResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/Viewcustomer`
        );
        const matchedCustomer = customerResponse.data.find(
          (c) => c._id === _id
        );
        if (matchedCustomer) {
          const projectDetails = await fetchName("getProject", matchedCustomer.project);
          const blockDetails = await fetchName("getBlock", matchedCustomer.project, matchedCustomer.block);
          const unitDetails = await fetchName("getUnit", matchedCustomer.project, matchedCustomer.block, matchedCustomer.plotOrUnit);
          const unitExtraDetails = await fetchUnitDetails(matchedCustomer.project, matchedCustomer.block, matchedCustomer.plotOrUnit);
          const paymentDetailsResponse = await fetchPaymentDetailsByCustomerId(matchedCustomer.customerId);  
          const updatedCustomer = {
            ...matchedCustomer,
            projectName: projectDetails.name.toUpperCase(),
            projectId: projectDetails._id,
            blockName: blockDetails.name.toUpperCase(),
            blockId: blockDetails._id,
            unitName: unitDetails.name.toUpperCase(),
            unitId: unitDetails._id,
            paymentDetails: paymentDetailsResponse.data,
            ...unitExtraDetails,
          };  
          setData(updatedCustomer);
          dispatch({ type: "SET_CUSTOMERS", payload: [updatedCustomer] });
          dispatch(setPaymentDetails(paymentDetailsResponse.data));  
          const teamLeadResponse = await axios.get(
            `${process.env.REACT_APP_API_URL}/Viewcustomer`
          );  
          const matchedEmployees = teamLeadResponse.data.filter(
            (e) => e.EmployeeName === matchedCustomer.EmployeeName
          );
          const uniqueTeamLeads = matchedEmployees.map((e) => ({
            name: e.Teamleadname,
            _id: e._id,
          }));
   setTeamLeadNames(uniqueTeamLeads);
        } else {
          dispatch({ type: "SET_ERROR", payload: "Customer not found." });
        }
      } catch (error) {
        console.error("Error fetching customer details:", error);
        dispatch({
          type: "SET_ERROR",
          payload: "Error fetching customer details. Please try again later.",
        });
      } finally {
        setLoading(false);
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };
    if (_id) {
      fetchCustomerDetails();
    } else {
      dispatch({ type: "SET_ERROR", payload: "No customer ID provided." });
      dispatch({ type: "SET_LOADING", payload: false });
      setLoading(false);
    }
  }, [_id]);
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
  const fetchName = async (endpoint, ...ids) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/${endpoint}/${ids.join("/")}`
      );
      const data = response.data.data;
      return {
        name: data.name,
        _id: data._id,
      };
    } catch (error) {
      console.error(`Error fetching ${endpoint} name:`, error);
      return {
        name: "Unknown",
        _id: "Unknown",
      };
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
        rate: "unknown",
        edcPrice: "unknown",
      };
    }
  };
  return (
    <div className="main-content">
      <div >
        {loading ? (
          <div className="d-flex justify-content-center">
          <Loading />
          </div>
        ) : teamLeadNames.length > 0 ? (
          <div>
          <h2 className="Headtext">{data?.EmployeeName} Details</h2>
          <div className="table-wrapper whiteback">
            <table id='viewcustomertable'>
              <thead>
                <tr>
                  <th>Team Lead Names</th>
                </tr>
              </thead>
              <tbody>
  {teamLeadNames.map((teamLead, index) => (
    <tr key={index}>
      <td>{teamLead.name.toUpperCase()}</td>
    </tr>
  ))}
</tbody>

            </table>
          </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default DirectorDetails;

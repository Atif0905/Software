// apiService.js
import axios from "axios";

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

const fetchProjects = async () => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/getallProjects`);
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
};

const fetchCustomerDetails = async (customerId) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/customer/${customerId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching customer details:", error);
    return null;
  }
};

const fetchPaymentDetails = async () => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/paymentDetails`);
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching payment details:", error);
    return [];
  }
};

export {
  fetchName,
  fetchUnitDetails,
  fetchPaymentDetailsByCustomerId,
  fetchProjects,
  fetchCustomerDetails,
  fetchPaymentDetails,
};

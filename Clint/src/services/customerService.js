import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL;
export const fetchCustomers = async () => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/customer`);
    console.log(response)
    return response.data;
  } catch (error) {
    throw new Error('Error fetching customers');
  }
};
export const fetchPaymentPlans = async () => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/paymentPlans`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching customers');
  }
};
export const fetchPaymentDetailsByCustomerId = async (customerId) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/paymentDetails/${customerId}`);
    return response.data;
  } catch (error) {
    return { data: [] };
  }
};
export const fetchName = async (endpoint, ...ids) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/${endpoint}/${ids.join('/')}`);
    return response.data.data.name;
  } catch (error) {
    console.error(`Error fetching ${endpoint} name:`, error);
    return 'Unknown';
  }
};
export const fetchUnitDetails = async (projectId, blockId, unitId) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/getUnit/${projectId}/${blockId}/${unitId}`);
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
    console.error('Error fetching unit details:', error);
    return {
      unitPrice: 'Unknown',
      idcCharges: 'Unknown',
      plcCharges: 'Unknown',
      plotSize: 'Unknown',
      sizeType: 'Unknown',
      rate: 'Unknown',
      edcPrice: 'Unknown',
    };
  }
};

export const fetchProjectRate = async (projectId) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/getProject/${projectId}`);
    return response.data.data.Bsprate;
  } catch (error) {
    console.error('Error fetching project rate:', error);
    return 'Unknown';
  }
};
export const fetchProjects = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/getAllProjects`);
    if (response.status === 200 && response.data.status === "ok") {
      const projectsWithUnitCount = await Promise.all(
        response.data.data.map(async (project) => {
          const blocksWithUnitCount = await Promise.all(
            project.blocks.map(async (block) => {
              const unitCount = await getUnitCount(project._id, block._id);
              return { ...block, unitCount };
            })
          );
          return { ...project, blocks: blocksWithUnitCount };
        })
      );
      return projectsWithUnitCount;
    } else {
      throw new Error(response.data.error || "Failed to fetch projects");
    }
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error; // Re-throw the error to handle it in the component
  }
};

// Fetch all payment details
export const fetchPaymentDetails = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/paymentDetails`);
    if (response.status === 200) {
      return response.data.data;
    } else {
      throw new Error("Failed to fetch payment details.");
    }
  } catch (error) {
    console.error("Error fetching payment details:", error);
    throw error;
  }
};

// Fetch unit count for a specific block within a project
export const getUnitCount = async (projectId, blockId) => {
  try {
    const response = await axios.get(`${BASE_URL}/getUnitCount/${projectId}/${blockId}`);
    if (response.status === 200 && response.data.status === "ok") {
      return response.data.unitCount;
    } else {
      throw new Error(response.data.error || "Failed to get unit count");
    }
  } catch (error) {
    console.error("Error getting unit count:", error);
    throw error;
  }
};
export const fetchCustomerDetails = async (customerId) => {
  try {
    const response = await axios.get(`${BASE_URL}/customer`);
    return response.data.find(customer => customer._id === customerId);
  } catch (error) {
    console.error("Error fetching customer details:", error);
    throw error;
  }
};
export const fetchCustomerDetailsById = async (customerId) => {
  try {
    const response = await axios.get(`${BASE_URL}/customer/${customerId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching customer details:", error);
    return null;
  }
};
export const fetchCreateRequest = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/createrequest`);
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Failed to fetch create request data.");
    }
  } catch (error) {
    console.error("Error fetching create request data:", error);
    throw error; // Re-throw the error to handle it in the component
  }
};
export const fetchAllUsers = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/getAllUser`);
    const { users, subAdmins } = response.data.data;
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Failed to fetch create request data.");
    }
  } catch (error) {
    console.error("Error fetching create request data:", error);
    throw error; // Re-throw the error to handle it in the component
  }
};
export const updateRequestStatus = async (_id, status) => {
  const response = await axios.put(`${BASE_URL}/createrequest/${_id}`, { status });
  return response.data;
};
import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../Confirmation/Loader";
const ProductPage = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedBlockId, setSelectedBlockId] = useState("null");
  const [showBlocks, setShowBlocks] = useState(true);
  const [showUnits, setShowUnits] = useState(true);
  const [projectUnitCounts, setProjectUnitCounts] = useState({});
  const [paymentDetails, setPaymentDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [unitFilter, setUnitFilter] = useState(null);
  const [expandedProjectId, setExpandedProjectId] = useState(null);
  useEffect(() => {
    fetchProjects();
  }, []);
  useEffect(() => {
    updateProjectUnitCounts();
  }, [projects]);
  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/paymentDetails`
        );
        const data = response.data.data;
        if (response.status === 200) {
          setPaymentDetails(data);
        } else {
          console.error("Failed to fetch payment details.");
        }
      } catch (error) {
        console.error("Error fetching payment details:", error);
      }
    };
    fetchPaymentDetails();
  }, []);
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const viewCustomerResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/customer`
        );
        const viewCustomerData = viewCustomerResponse.data;
        const allProjectsResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/getAllProjects`
        );
        const allProjectsData = allProjectsResponse.data.data;
        const customersWithDetails = await Promise.all(
          viewCustomerData.map(async (customer) => {
            const project = allProjectsData.find(
              (proj) => proj._id === customer.project
            );
            if (project) {
              const blockName = await fetchName(
                "getBlock",
                customer.project,
                customer.block
              );
              const unitName = await fetchName(
                "getUnit",
                customer.project,
                customer.block,
                customer.plotOrUnit
              );
              const paymentDetails = await fetchPaymentDetailsByCustomerId(
                customer.customerId
              );
              return {
                ...customer,
                projectName: project.name.toUpperCase(),
                blockName: blockName.toUpperCase(),
                unitName: unitName.toUpperCase(),
                paymentDetails: paymentDetails.data,
              };
            } else {
              console.error(
                `Project not found for customer with ID ${customer.customerId}`
              );
              return null;
            }
          })
        );
        const filteredCustomers = customersWithDetails.filter(
          (customer) => customer !== null
        );
        setCustomers(filteredCustomers);
        const totalAmountsByProject =
          calculateTotalAmountsByProject(filteredCustomers);
        setPaymentDetails(totalAmountsByProject);
      } catch (error) {
        console.error("Error fetching customers:", error);
        setError("Error fetching customers. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);
  const calculateTotalAmountsByProject = (customers) => {
    const totalAmountsByProject = {};
    customers.forEach((customer) => {
      const projectId = customer.project;
      const totalAmountReceived = customer.paymentDetails.reduce(
        (sum, payment) => sum + payment.amount,
        0
      );
      if (!totalAmountsByProject[projectId]) {
        totalAmountsByProject[projectId] = 0;
      }
      totalAmountsByProject[projectId] += totalAmountReceived;
    });
    return totalAmountsByProject;
  };
  const fetchPaymentDetailsByCustomerId = async (customerId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/paymentDetails/${customerId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching payment details:", error);
      throw new Error(
        "Error fetching payment details. Please try again later."
      );
    }
  };
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

  const fetchProjects = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/getAllProjects`
      );
      const data = response.data;
      if (response.status === 200 && data.status === "ok") {
        const projectsWithUnitCount = await Promise.all(
          data.data.map(async (project) => {
            const blocksWithUnitCount = await Promise.all(
              project.blocks.map(async (block) => {
                const unitCount = await getUnitCount(project._id, block._id);
                return { ...block, unitCount };
              })
            );
            return { ...project, blocks: blocksWithUnitCount };
          })
        );
        setProjects(projectsWithUnitCount);
      } else {
        console.error("Failed to fetch projects:", data.error);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };
  const getUnitCount = async (projectId, blockId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/getUnitCount/${projectId}/${blockId}`
      );
      const data = response.data;
      if (response.status === 200 && data.status === "ok") {
        return data.unitCount;
      } else {
        console.error("Failed to get unit count:", data.error);
        return 0;
      }
    } catch (error) {
      console.error("Error getting unit count:", error);
      return 0;
    }
  };

  const updateProjectUnitCounts = () => {
    const counts = {};
    projects.forEach((project) => {
      const {
        totalUnits,
        totalAvailableUnits,
        totalHoldUnits,
        totalSoldUnits,
      } = calculateUnitCountsByProjectId(project._id);
      counts[project._id] = {
        totalUnits,
        totalAvailableUnits,
        totalHoldUnits,
        totalSoldUnits,
      };
    });
    setProjectUnitCounts(counts);
  };
  const calculateUnitCountsByProjectId = (projectId) => {
    const project = projects.find((project) => project._id === projectId);
    if (!project) {
      return {
        totalUnits: 0,
        totalAvailableUnits: 0,
        totalHoldUnits: 0,
        totalSoldUnits: 0,
      };
    }
    let totalUnits = 0;
    let totalAvailableUnits = 0;
    let totalHoldUnits = 0;
    let totalSoldUnits = 0;
    project.blocks.forEach((block) => {
      block.units.forEach((unit) => {
        totalUnits += 1;
        if (unit.status === "hold") {
          totalHoldUnits += 1;
        } else if (unit.status === "sold") {
          totalSoldUnits += 1;
        } else {
          totalAvailableUnits += 1;
        }
      });
    });
    return {
      totalUnits,
      totalAvailableUnits,
      totalHoldUnits,
      totalSoldUnits,
    };
  };
  const handleClickProject = (projectId) => {
    setSelectedProjectId(projectId);
    setSelectedBlockId("null");
    setShowBlocks(!showBlocks);
    setShowUnits(true);
  };
  const calculateTotalPriceSum = (projectId) => {
    let totalPriceSum = 0;
    const selectedProject = projects.find(
      (project) => project._id === projectId
    );
    if (selectedProject) {
      selectedProject.blocks.forEach((block) => {
        block.units.forEach((unit) => {
          totalPriceSum += parseFloat(unit.totalPrice || 0);
        });
      });
    }
    return totalPriceSum;
  };
  const filterUnits = (units) => {
    if (unitFilter === "available") {
      return units.filter((unit) => unit.status === "available");
    }
    if (unitFilter === "hold") {
      return units.filter((unit) => unit.status === "hold");
    }
    if (unitFilter === "sold") {
      return units.filter((unit) => unit.status === "sold");
    }
    return units;
  };
  const handleProjectClick = (projectId) => {
    setExpandedProjectId((prev) => (prev === projectId ? null : projectId));
  };

  const handleFilterClick = (filterType) => {
    setUnitFilter((prev) => (prev === filterType ? null : filterType));
  };
  return (
    <div className="main-content">
     {loading && <Loader />}
      <div className="formback1 ">
        <div className="p-2 ">
          <table id="producttable">
            <thead>
              <tr>
                <td>Name</td>
                <td>Available Units</td>
                <td>Hold Units</td>
                <td>Sold Units</td>
                <td>Total Payment</td>
                <td>Received Payment</td>
                <td>Due Payment</td>
              </tr>
            </thead>
            <tbody>
              {projects.slice(0, 3).map((project, index) => {
                const totalPriceSum = calculateTotalPriceSum(project._id);
                return (
                  <React.Fragment key={index}>
                    <tr onClick={() => handleProjectClick(project._id)}>
                      <td className="tablecursor">
                        {project.name.toUpperCase()}
                      </td>
                      <td
                        className="tablecursor"
                        onClick={() => handleFilterClick("available")}
                      >
                        {projectUnitCounts[project._id]?.totalAvailableUnits ||
                          0}
                      </td>
                      <td
                        className="tablecursor"
                        onClick={() => handleFilterClick("hold")}
                      >
                        {projectUnitCounts[project._id]?.totalHoldUnits || 0}
                      </td>
                      <td
                        className="tablecursor"
                        onClick={() => handleFilterClick("sold")}
                      >
                        {projectUnitCounts[project._id]?.totalSoldUnits || 0}
                      </td>
                      <td>{totalPriceSum}</td>
                      <td>{(paymentDetails[project._id] || 0).toFixed(2)}</td>
                      <td>
                        {(
                          totalPriceSum - (paymentDetails[project._id] || 0)
                        ).toFixed(2)}
                      </td>
                    </tr>
                    {expandedProjectId === project._id &&
                      project.blocks.map((block, blockIndex) => (
                        
                        <React.Fragment key={`block-${block._id}`}>
                          <tr>
                            <th>Block Name</th>
                            <th>Unit Name</th>
                            <th>Unit Status</th>
                          </tr>
                          {filterUnits(block.units).map((unit, unitIndex) => (
                            <tr key={`unit-${unit._id}`}>
                              <td>{block.name}</td>
                              <td>{unit.name}</td>
                              <td>{unit.status}</td>
                            </tr>
                          ))}
                        </React.Fragment>
                      ))}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default ProductPage;

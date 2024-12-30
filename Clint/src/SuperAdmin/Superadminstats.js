import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../Confirmation/Loader";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,} from "recharts";
import "./Main.css";
const Superadminstats = () => {
  const [projects, setProjects] = useState([]);
  const [projectUnitCounts, setProjectUnitCounts] = useState({});
  const [paymentDetails, setPaymentDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [allProjectsUnits, setAllProjectsUnits] = useState(null);
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
  useEffect(() => {
    const unitCounts = calculateTotalUnitsForAllProjects();
    setAllProjectsUnits(unitCounts);
  }, [projects]);
  const calculateTotalUnitsForAllProjects = () => {
    let totalUnits = 0;
    let totalAvailableUnits = 0;
    let totalHoldUnits = 0;
    let totalSoldUnits = 0;
    projects.forEach((project) => {
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
    });
    return {
      totalUnits,
      totalAvailableUnits,
      totalHoldUnits,
      totalSoldUnits,
    };
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
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="custom-tooltip"
          style={{
            backgroundColor: "#fff",
            padding: "10px",
            border: "1px solid #ccc",
          }}
        >
          <p className="label">{`Project Name: ${payload[0].payload.fullName.toUpperCase()}`}</p>
          <p>{`Available: ${payload[0].payload.available}`}</p>
          <p>{`Hold: ${payload[0].payload.hold}`}</p>
          <p>{`Sold: ${payload[0].payload.sold}`}</p>
        </div>
      );
    }

    return null;
  };
  const graphData = projects.map((project) => ({
    name: project.name
      .split(" ")
      .map((word) => word[0].toUpperCase())
      .join(""),
    fullName: project.name, // Add full name for tooltip
    available: projectUnitCounts[project._id]?.totalAvailableUnits || 0,
    hold: projectUnitCounts[project._id]?.totalHoldUnits || 0,
    sold: projectUnitCounts[project._id]?.totalSoldUnits || 0,
    total: calculateTotalPriceSum(project._id),
    received: paymentDetails[project._id] || 0,
    due:
      calculateTotalPriceSum(project._id) - (paymentDetails[project._id] || 0),
  }));
  return (
    <div className="main-content">
      {loading && (
        <div>
          <Loader />
        </div>
      )}

      <div className="container">
        <div>
          <div className="summarydiv">
            <h4>Summary</h4>
            <div className="between summarylist summarylist1">
              <li className="">Total Units</li>
              <div>{allProjectsUnits.totalUnits}</div>
            </div>
            <div className="between summarylist summarylist2">
              <li className="">Available Units</li>
              <div>{allProjectsUnits.totalAvailableUnits}</div>
            </div>
            <div className="between summarylist summarylist3">
              <li className="">Hold Units</li>
              <div>{allProjectsUnits.totalHoldUnits}</div>
            </div>
            <div className="between summarylist summarylist4">
              <li className="">Sold Units</li>
              <div>{allProjectsUnits.totalSoldUnits}</div>
            </div>
          </div>
        </div>
        <div className="mt-3">
        <ResponsiveContainer width="90%" height={400}>
          <BarChart data={graphData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="available" stackId="a" fill="#8C78EA" />
            <Bar dataKey="hold" stackId="a" fill="#E0DAFF" />
            <Bar dataKey="sold" stackId="a" fill="#FBD4F5" />
          </BarChart>
        </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
export default Superadminstats;
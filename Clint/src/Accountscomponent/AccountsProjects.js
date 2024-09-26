import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FaMoneyCheck } from "react-icons/fa6";
import { FaGreaterThan } from "react-icons/fa6";
import Loader from "../Confirmation/Loader";
import { Pie } from "react-chartjs-2"; // Import Pie chart
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

const AccountsProjects = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedBlockId, setSelectedBlockId] = useState("null");
  const [showBlocks, setShowBlocks] = useState(true);
  const [showUnits, setShowUnits] = useState(true);
  const [chartData, setChartData] = useState({});
  const [blockwiseUnitCounts, setBlockwiseUnitCounts] = useState({});
  const [blockwiseHoldUnitCounts, setBlockwiseHoldUnitCounts] = useState({});
  const [blockwiseSoldUnitCounts, setBlockwiseSoldUnitCounts] = useState({});
  const [blockwiseAvailableUnitCounts, setBlockwiseAvailableUnitCounts] =
    useState({});
  const [projectUnitCounts, setProjectUnitCounts] = useState({});
  const [paymentDetails, setPaymentDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customers, setCustomers] = useState([]);
  useEffect(() => {
    fetchProjects();
  }, []);

  const updateUnitCounts = () => {
    let totalUnits = 0;
    let blockCounts = {};
    projects.forEach((project) => {
      project.blocks.forEach((block) => {
        totalUnits += block.units.length;
        blockCounts[block._id] = block.units.length;
      });
    });
    setBlockwiseUnitCounts(blockCounts);
  };
  const updateHoldUnitCounts = () => {
    let totalHoldUnits = 0;
    let blockwiseHoldCounts = {};
    projects.forEach((project) => {
      project.blocks.forEach((block) => {
        const holdUnits = block.units.filter((unit) => unit.status === "hold");
        totalHoldUnits += holdUnits.length;
        blockwiseHoldCounts[block._id] = holdUnits.length;
      });
    });
    setBlockwiseHoldUnitCounts(blockwiseHoldCounts);
  };
  useEffect(() => {
    updateUnitCounts();
    updateTotalUnitsCount();
    updateHoldUnitCounts();
    updateSoldUnitCounts();
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
        console.log(allProjectsResponse);
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
  const updateTotalUnitsCount = () => {
    let totalUnits = 0;
    let totalAvailableUnits = 0;
    let blockwiseAvailableCounts = {};
    projects.forEach((project) => {
      project.blocks.forEach((block) => {
        const availableUnits = block.units.filter(
          (unit) => unit.status !== "hold" && unit.status !== "sold"
        );
        totalAvailableUnits += availableUnits.length;
        blockwiseAvailableCounts[block._id] = availableUnits.length;

        totalUnits += block.units.length;
      });
    });
    setBlockwiseAvailableUnitCounts(blockwiseAvailableCounts);
  };
  const updateSoldUnitCounts = () => {
    let totalSoldUnits = 0;
    let blockwiseSoldCounts = {};
    projects.forEach((project) => {
      project.blocks.forEach((block) => {
        const soldUnits = block.units.filter((unit) => unit.status === "sold");
        totalSoldUnits += soldUnits.length;
        blockwiseSoldCounts[block._id] = soldUnits.length;
      });
    });
    setBlockwiseSoldUnitCounts(blockwiseSoldCounts);
  };
  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/getAllProjects`);
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
        totalSoldUnits,
      } = calculateUnitCountsByProjectId(project._id);
      counts[project._id] = {
        totalUnits,
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
        totalSoldUnits: 0,
      };
    }
    let totalUnits = 0;
    let totalSoldUnits = 0;
    project.blocks.forEach((block) => {
      block.units.forEach((unit) => {
        totalUnits += 1;
        if (unit.status === "sold") {
          totalSoldUnits += 1;
        } 
      });
    });
    return {
      totalUnits,
      totalSoldUnits,
    };
  };
  const handleClickProject = (projectId) => {
    setSelectedProjectId(projectId);
    setSelectedBlockId("null");
    setShowBlocks(!showBlocks);
    setShowUnits(true);
  };
  useEffect(() => {
    if (selectedProjectId) {
      updateChartData(selectedProjectId);
    }
  }, [selectedProjectId]);

  const updateChartData = (projectId) => {
    const project = projects.find((proj) => proj._id === projectId);
    if (project) {
      const totalUnits = project.blocks.reduce((total, block) => total + block.units.length, 0);
      const totalSoldUnits = project.blocks.reduce((total, block) => 
        total + block.units.filter((unit) => unit.status === "sold").length, 
        0
      );
      
      setChartData({
        labels: ['Total Units', 'Sold Units'],
        datasets: [{
          data: [totalUnits- totalSoldUnits, totalSoldUnits],
          backgroundColor: ['#36A2EB', '#FF6384'],
          hoverBackgroundColor: ['#36A2EB', '#FF6384'],
        }]
      });
    }
  };
  const closeModal = () => {
    const body = document.querySelector("body");
    const modalWrapper = document.querySelector(".modal-wrapper");
    modalWrapper.style.display = "none";
    body.style.overflow = "auto";
  };
  const calculateTotalPriceSum = () => {
    let totalPriceSum = 0;
    if (selectedProjectId) {
      const selectedProject = projects.find(
        (project) => project._id === selectedProjectId
      );
      if (selectedProject) {
        selectedProject.blocks.forEach((block) => {
          block.units.forEach((unit) => {
            totalPriceSum += parseFloat(unit.totalPrice);
          });
        });
      }
    }
    return totalPriceSum;
  };
  const totalPriceSum = calculateTotalPriceSum();
  return (
    <div className="">
      {loading && <div className=""><Loader /></div>}
      <div className="formback1 ">
        <div className="p-3 mt-3">
        {projects.slice(0, 3).map((project, index) => (
          <div key={index} className="">
            <div className={` projectdiv ${index === 0 ? 'projectdiv1' : index === 1 ? 'projectdiv2' : 'projectdiv3'}`}>
              <div className="coloureddiv1">
                <h3 className="colouredtext">{project.name.toUpperCase()}</h3>
                <div className="upperconatiner">
                <p className="descriptiondiv">
                  {project.description.toUpperCase()}
                </p>
                <p className="pright mt-2" onClick={() => handleClickProject(project._id)}><FaGreaterThan className={`datashow ${index === 0 ? 'datashow1' : index === 1 ? 'datashow2' : 'datashow3'}`} /></p></div>
              </div>
            </div>
            {selectedProjectId === project._id && showBlocks && (
              <div className="modal-wrapper"><FontAwesomeIcon icon={faTimes} size="2x" className="closeicon" onClick={closeModal}/>
                <div className="modal-container">
                  <div className="flexy">
                    <div className="paymentmaindiv">
                      <div className="coloureddiv1 p-3">
                        <h3 className="colouredtext">Total Payment</h3>
                        <div className="d-flex justify-content-between">
                          <p className="colouredtext1">{totalPriceSum}</p>
                          <h6 className="react-icon-red"> <FaMoneyCheck /> </h6>
                        </div>
                      </div>
                    </div>
                    <div className="paymentmaindiv">
                      <div className="coloureddiv1 p-3">
                        <h3 className="colouredtext">Received Payment</h3>
                        <div className="d-flex justify-content-between">
                          <p className="colouredtext1">
                            {(paymentDetails[selectedProjectId] || 0).toFixed(
                              2
                            )}
                          </p>
                          <h6 className="react-icon-red">
                            <FaMoneyCheck />
                          </h6>
                        </div>
                      </div>
                    </div>
                    <div className="paymentmaindiv">
                      <div className="coloureddiv1 p-3">
                        <h3 className="colouredtext">Due Payment</h3>
                        <div className="d-flex justify-content-between">
                          <p className="colouredtext1">
                            {(
                              totalPriceSum -
                              (paymentDetails[selectedProjectId] || 0)
                            ).toFixed(2)}
                          </p>
                          <h6 className="react-icon-red">
                            <FaMoneyCheck />
                          </h6>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex justify-content-around mb-3">
                    <div className="totalunitsdiv mt-3">
                      <h2 className="textunits"> Total </h2>
                      <p className="unitsnum">
                        {projectUnitCounts[project._id]?.totalUnits || 0}
                      </p>
                    </div>
                    <div className="solunitsdiv mt-3">
                      <h2 className="textunits"> Sold </h2>
                      <p className="unitsnum">
                        {projectUnitCounts[project._id]?.totalSoldUnits || 0}
                      </p>
                    </div>
                  </div> 
                  <div><Pie data={chartData} className="pie-chart-container " /></div>
                </div>
              </div>
            )}
          </div>
        ))}
        </div>
      </div>
    </div>
  );
};
export default AccountsProjects;
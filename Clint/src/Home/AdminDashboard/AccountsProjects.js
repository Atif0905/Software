import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faLocationDot, faTimes } from "@fortawesome/free-solid-svg-icons";
import "../../UpdateProjects/Projects.css";
import { IoBagOutline } from "react-icons/io5";
import { faMoneyBill, faWallet } from '@fortawesome/free-solid-svg-icons';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from 'chart.js';
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);
const AccountsProjects = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [showBlocks, setShowBlocks] = useState(true);
  const [blockwiseAvailableUnitCounts, setBlockwiseAvailableUnitCounts] = useState({});
  const [projectUnitCounts, setProjectUnitCounts] = useState({});
  const [paymentDetails, setPaymentDetails] = useState({});
  const [blockwiseSoldUnitCounts, setBlockwiseSoldUnitCounts] = useState({});
  useEffect(() => { fetchProjects(); }, []);  
  const updateUnitCounts = () => {
    let blockCounts = {};
    projects.forEach((project) => {
      project.blocks.forEach((block) => {
        blockCounts[block._id] = block.units.length;
      });
    });
    setBlockwiseAvailableUnitCounts(blockCounts);
  };
  useEffect(() => {
    updateUnitCounts();
    updateTotalUnitsCount();
    updateSoldUnitCounts();
    updateProjectUnitCounts();
  }, [projects]);
  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/paymentDetails`);
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
  const updateTotalUnitsCount = () => {
    let totalAvailableUnits = 0;
    let blockwiseAvailableCounts = {};
    projects.forEach((project) => {
      project.blocks.forEach((block) => {
        const availableUnits = block.units.filter(
          (unit) => unit.status !== "hold" && unit.status !== "sold"
        );
        totalAvailableUnits += availableUnits.length;
        blockwiseAvailableCounts[block._id] = availableUnits.length;
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
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/getUnitCount/${projectId}/${blockId}`);
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
      const { totalUnits, totalSoldUnits } = calculateUnitCountsByProjectId(project._id);
      counts[project._id] = { totalUnits, totalSoldUnits };
    });
    setProjectUnitCounts(counts);
  };
  const calculateUnitCountsByProjectId = (projectId) => {
    const project = projects.find((project) => project._id === projectId);
    if (!project) {
      return { totalUnits: 0, totalSoldUnits: 0 };
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
    return { totalUnits, totalSoldUnits };
  };
  const handleClickProject = (projectId) => {
    setSelectedProjectId(projectId);
    setShowBlocks(!showBlocks);
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
      const selectedProject = projects.find((project) => project._id === selectedProjectId);
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

  const getPieChartData = () => {
    if (selectedProjectId) {
      const projectCounts = projectUnitCounts[selectedProjectId] || {};
      const totalUnits = projectCounts.totalUnits || 0;
      const totalSoldUnits = projectCounts.totalSoldUnits || 0;
      const totalAvailableUnits = totalUnits - totalSoldUnits;

      return {
        labels: ['Sold Units', 'Available Units'],
        datasets: [
          {
            label: 'Unit Status',
            data: [totalSoldUnits, totalAvailableUnits],
            backgroundColor: ['#FF6384', '#36A2EB'],
            borderColor: ['#FF6384', '#36A2EB'],
            borderWidth: 1,
          },
        ],
      };
    }
    return { labels: [], datasets: [] };
  };

  const pieChartData = getPieChartData();

  return (
    <div className="container">
      <div className="projects-grid mt-3">
        {projects.map((project, index) => (
          <div key={index} className="position-relative">
            <div className="projectdiv">
              <div className="coloureddiv1">
                <h3 className="colouredtext">{project.name}</h3>
              </div>
              <div className="coloureddiv d-flex justify-content-between">
                <p className="descriptiondiv">
                  {project.description} <FontAwesomeIcon icon={faLocationDot} />
                </p>
                <p className="react-icon"><IoBagOutline /></p>
              </div>
              <div
                className="viewdetail-div"
                onClick={() => handleClickProject(project._id)}
              >
                <div className="viewbutton-div">
                  <p className="moredetail-text mt-3">View More Details</p>
                  <FontAwesomeIcon icon={faCaretDown} className="moredetail" />
                </div>
              </div>
            </div>
            {selectedProjectId === project._id && showBlocks && (
              <div className="modal-wrapper">
                <FontAwesomeIcon
                  icon={faTimes}
                  size="2x"
                  className="closeicon"
                  onClick={closeModal}
                />
                <div className="modal-container">
                  <h4>{project.name}</h4>
                  <div className="flexy">
                    <div className="accountspaymentmaindiv">
                      <div className="coloureddiv1">
                        <div className="fontcolour">
                          <FontAwesomeIcon icon={faMoneyBill} className="fontmargin"/>
                        </div>
                        <h3 className="accountscolouredtext">Total Payment</h3>
                        <div className="d-flex justify-content-between">
                          <p className="accountscolouredtext1"> ₹{totalPriceSum}</p>
                        </div>
                      </div>
                    </div>
                    <div className="accountspaymentmaindiv">
                      <div className="coloureddiv1">
                        <div className="fontcolour1">
                          <FontAwesomeIcon icon={faWallet} className="fontmargin"/>
                        </div>
                        <h3 className="accountscolouredtext">Received Payment</h3>
                        <div className="d-flex justify-content-between">
                          <p className="accountscolouredtext1">
                            ₹{(paymentDetails[selectedProjectId] || 0).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="accountspaymentmaindiv">
                      <div className="coloureddiv1">
                        <div className="fontcolour">
                          <FontAwesomeIcon icon={faMoneyBill} className="fontmargin"/>
                        </div>
                        <h3 className="accountscolouredtext">Due Payment</h3>
                        <div className="d-flex justify-content-between">
                          <p className="accountscolouredtext1">
                            ₹{(
                              totalPriceSum -
                              (paymentDetails[selectedProjectId] || 0)
                            ).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex justify-content-around mt-3">
                    <div className="unitdiv">
                      <h4 className="text-center mt-3">Total</h4>
                      <h6 className="unitdivtext">
                        {projectUnitCounts[project._id]?.totalUnits || 0}
                      </h6>
                    </div>
                    <div className="unitsolddiv">
                      <h4 className="text-center mt-3">Sold</h4>
                      <h6 className="unitdivtext">
                        {projectUnitCounts[project._id]?.totalSoldUnits || 0}
                      </h6>
                    </div>
                  </div>
                  <div className="mt-5">
                    {/* <h4>The Percentage of Project Sold is {parseFloat((projectUnitCounts[project._id]?.totalSoldUnits || 0) / (projectUnitCounts[project._id]?.totalUnits || 0) * 100).toFixed(2) || 0}%</h4> */}
                  </div>
                  <div className="pie-chart-container mt-5">
                    <Pie data={pieChartData} />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccountsProjects;

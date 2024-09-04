import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faLocationDot, faTimes, faMoneyBill, faWallet } from "@fortawesome/free-solid-svg-icons";
import { IoBagOutline } from "react-icons/io5";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from "chart.js";
import "../../UpdateProjects/Projects.css";

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

const AccountsProjects = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [showBlocks, setShowBlocks] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState({});

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/getAllProjects`);
        if (response.status === 200 && response.data.status === "ok") {
          setProjects(response.data.data);
        } else {
          console.error("Failed to fetch projects:", response.data.error);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    const fetchPaymentDetails = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/paymentDetails`);
        if (response.status === 200) {
          setPaymentDetails(response.data.data);
        } else {
          console.error("Failed to fetch payment details.");
        }
      } catch (error) {
        console.error("Error fetching payment details:", error);
      }
    };

    fetchProjects();
    fetchPaymentDetails();
  }, []);

  const handleClickProject = (projectId) => {
    setSelectedProjectId((prevId) => (prevId === projectId ? "" : projectId));
    setShowBlocks((prevShow) => !prevShow);
  };

  const closeModal = () => {
    document.querySelector(".modal-wrapper").style.display = "none";
    document.body.style.overflow = "auto";
  };

  const calculateTotalPriceSum = useMemo(() => {
    if (!selectedProjectId) return 0;

    const selectedProject = projects.find((project) => project._id === selectedProjectId);
    if (!selectedProject) return 0;

    return selectedProject.blocks.reduce((sum, block) => {
      return sum + block.units.reduce((unitSum, unit) => unitSum + parseFloat(unit.totalPrice), 0);
    }, 0);
  }, [selectedProjectId, projects]);

  const projectUnitCounts = useMemo(() => {
    return projects.reduce((counts, project) => {
      const totalUnits = project.blocks.reduce((sum, block) => sum + block.units.length, 0);
      const totalSoldUnits = project.blocks.reduce((sum, block) => sum + block.units.filter(unit => unit.status === "sold").length, 0);

      counts[project._id] = { totalUnits, totalSoldUnits };
      return counts;
    }, {});
  }, [projects]);

  const pieChartData = useMemo(() => {
    if (!selectedProjectId) return { labels: [], datasets: [] };

    const { totalUnits = 0, totalSoldUnits = 0 } = projectUnitCounts[selectedProjectId] || {};
    const totalAvailableUnits = totalUnits - totalSoldUnits;

    return {
      labels: ["Sold Units", "Available Units"],
      datasets: [
        {
          label: "Unit Status",
          data: [totalSoldUnits, totalAvailableUnits],
          backgroundColor: ["#FF6384", "#36A2EB"],
          borderColor: ["#FF6384", "#36A2EB"],
          borderWidth: 1,
        },
      ],
    };
  }, [selectedProjectId, projectUnitCounts]);

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
                <p className="react-icon">
                  <IoBagOutline />
                </p>
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
                          <p className="accountscolouredtext1"> ₹{calculateTotalPriceSum.toFixed(2)}</p>
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
                              calculateTotalPriceSum.toFixed(2) -
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
                    <h4>The Percentage of Project Sold is {parseFloat((projectUnitCounts[project._id]?.totalSoldUnits || 0) / (projectUnitCounts[project._id]?.totalUnits || 0) * 100).toFixed(2) || 0}%</h4>
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

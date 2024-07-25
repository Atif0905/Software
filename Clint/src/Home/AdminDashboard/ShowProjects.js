import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  faCaretDown,  faLocationDot,  faTimes,} from "@fortawesome/free-solid-svg-icons";
import "../../UpdateProjects/Projects.css";
import "../AdminDashboard/Uploads/Coustmer";
import { IoBagOutline } from "react-icons/io5";
import { FaMoneyCheck } from "react-icons/fa6";
const UploadedProjects = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedBlockId, setSelectedBlockId] = useState("null");
  const [showBlocks, setShowBlocks] = useState(true);
  const [showUnits, setShowUnits] = useState(true);
  const [blockwiseUnitCounts, setBlockwiseUnitCounts] = useState({});
  const [blockwiseHoldUnitCounts, setBlockwiseHoldUnitCounts] = useState({});
  const [blockwiseSoldUnitCounts, setBlockwiseSoldUnitCounts] = useState({});
  const [blockwiseAvailableUnitCounts, setBlockwiseAvailableUnitCounts] =useState({});
  const [projectUnitCounts, setProjectUnitCounts] = useState({});
  const [UnitDropdown, setUnitDropdown] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customers, setCustomers] = useState([]);
  useEffect(() => {fetchProjects();}, []);
  const DropdownToggle = (unitIndex) => {
    setUnitDropdown((prevIndex) =>
      prevIndex === unitIndex ? null : unitIndex
    );
  };
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
  const handleMarkUnitSold = async (projectId, blockId, unitId) => {
    const isConfirmed = window.confirm("Are you sure you want to mark this unit as Sold?");
    if (isConfirmed) {
      try {
        const response = await axios.put(
          `${process.env.REACT_APP_API_URL}/markUnitSold/${projectId}/${blockId}/${unitId}`
        );
        const data = response.data;
        if (response.status === 200 && data.status === "ok") {
          fetchProjects();
          alert("Unit marked as sold successfully");
        } else {
          console.error("Failed to mark unit as sold:", data.error);
        }
      } catch (error) {
        console.error("Error marking unit as sold:", error);
      }
    }
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
          `${process.env.REACT_APP_API_URL}/Viewcustomer`
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
  const handleMarkUnitHold = async (projectId, blockId, unitId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to mark this unit as Hold?"
    );
    if (isConfirmed) {
      try {
        const response = await axios.put(
          `${process.env.REACT_APP_API_URL}/markUnitHold/${projectId}/${blockId}/${unitId}`
        );
        const data = response.data;
        if (response.status === 200 && data.status === "ok") {
          fetchProjects();
          alert("Unit marked as hold successfully");
        } else {
          console.error("Failed to mark unit as hold:", data.error);
        }
      } catch (error) {
        console.error("Error marking unit as hold:", error);
      }
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
  const handleMarkUnitAvailable = async (projectId, blockId, unitId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to mark this unit as Available?"
    );
    if (isConfirmed) {
      try {
        const response = await axios.put(
          `${process.env.REACT_APP_API_URL}/markUnitAvailable/${projectId}/${blockId}/${unitId}`
        );
        const data = response.data;
        if (response.status === 200 && data.status === "ok") {
          fetchProjects();
          alert("Unit marked as available successfully");
        } else {
          console.error("Failed to mark unit as available:", data.error);
        }
      } catch (error) {
        console.error("Error marking unit as available:", error);
      }
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
  const handleClickBlock = (blockId) => {
    setSelectedBlockId((prevId) => (prevId === blockId ? null : blockId));
  };
  const handleDeleteUnit = async (projectId, blockId, unitId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this unit?"
    );
    if (isConfirmed) {
      try {
        const response = await axios.delete(
          `${process.env.REACT_APP_API_URL}/deleteUnit/${projectId}/${blockId}/${unitId}`
        );
        const data = response.data;
        if (response.status === 200 && data.status === "ok") {
          fetchProjects();
        } else {
          console.error("Failed to delete unit:", data.error);
        }
      } catch (error) {
        console.error("Error deleting unit:", error);
      }
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
    <div className="container">
      <div className="projects-grid mt-3">
        {projects.map((project, index) => (
          <div key={index} className=" position-relative">
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
                  <div className="flexy">
                    <div className="paymentmaindiv">
                      <div className="coloureddiv1">
                        <h3 className="colouredtext">Total Payment</h3>
                        <div className="d-flex justify-content-between">
                          <p className="colouredtext1">{totalPriceSum}</p>
                          <h6 className="react-icon-red">
                            <FaMoneyCheck />
                          </h6>
                        </div>
                      </div>
                    </div>
                    <div className="paymentmaindiv">
                      <div className="coloureddiv1">
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
                      <div className="coloureddiv1">
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
                  <div className="d-flex justify-content-between mb-3">
                    <div className="totalunitsdiv mt-3">
                      <h2 className="textunits"> Total </h2>
                      <p className="unitsnum">
                        {projectUnitCounts[project._id]?.totalUnits || 0}
                      </p>
                    </div>
                    <div className="availableunitsdiv mt-3">
                      <h2 className="textunits"> Available </h2>
                      <p className="unitsnum">
                        {projectUnitCounts[project._id]?.totalAvailableUnits ||
                          0}
                      </p>
                    </div>
                    <div className="holunitsdiv mt-3">
                      <h2 className="textunits"> Hold </h2>
                      <p className="unitsnum">
                        {projectUnitCounts[project._id]?.totalHoldUnits || 0}
                      </p>
                    </div>
                    <div className="solunitsdiv mt-3">
                      <h2 className="textunits"> Sold </h2>
                      <p className="unitsnum">
                        {projectUnitCounts[project._id]?.totalSoldUnits || 0}
                      </p>
                    </div>
                  </div>
                  <table className="table">
                    <thead>
                      <tr>
                        <th className="blockdivstart">ID</th>
                        <th className="blockdiv">Blocks</th>
                        <th className="blockdiv">Total Units</th>
                        <th className="blockdiv">Available Units</th>
                        <th className="blockdiv">Hold Units</th>
                        <th className="blockdiv">Sold Units</th>
                      </tr>
                    </thead>
                    <tbody>
                      {project.blocks.map((block, blockIndex) => (
                        <tr
                          key={blockIndex}
                          onClick={() => handleClickBlock(block._id)}
                        >
                          <td>{blockIndex + 1}</td>
                          <td className="tablecursor">{block.name}</td>
                          <td className="tablecursor">
                            {blockwiseUnitCounts[block._id]}
                          </td>
                          <td className="tablecursor">
                            {blockwiseAvailableUnitCounts[block._id]}
                          </td>
                          <td className="tablecursor">
                            {blockwiseHoldUnitCounts[block._id] || 0}
                          </td>
                          <td className="tablecursor">
                            {blockwiseSoldUnitCounts[block._id] || 0}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <ul>
                    {project.blocks.map((block, blockIndex) => (
                      <div className="" key={blockIndex}>
                        {selectedBlockId === block._id && showUnits && (
                          <>
                            <ul>
                              <div className="row">
                                {block.units.map((unit, unitIndex) => (
                                  <div className="col-1" key={unitIndex}>
                                    <div
                                      className="units-div"
                                      style={{
                                        backgroundColor:
                                          unit.status === "hold"
                                            ? "#FEE69F"
                                            : unit.status === "sold"
                                            ? "#FE8B8B"
                                            : unit.status === "available"
                                            ? "#A6FFBF"
                                            : "#A6FFBF",
                                      }}
                                      onClick={() => DropdownToggle(unitIndex)}
                                    >
                                      <p className="unit-div">{unit.name}</p>
                                    </div>
                                    {UnitDropdown === unitIndex && (
                                      <div className="unit-div-dropdown">
                                        {unit.status === "available" && <></>}
                                        {unit.status === "sold" && (
                                          <>
                                            <button
                                              className="hold-unit"
                                              onClick={() =>
                                                handleMarkUnitHold(
                                                  project._id,
                                                  block._id,
                                                  unit._id
                                                )
                                              }
                                            >
                                              Hold
                                            </button>
                                            <button
                                              className="available-unit"
                                              style={{
                                                backgroundColor: "#A6FFBF",
                                              }}
                                              onClick={() =>
                                                handleMarkUnitAvailable(
                                                  project._id,
                                                  block._id,
                                                  unit._id
                                                )
                                              }
                                            >
                                              {" "}
                                              Available
                                            </button>
                                          </>
                                        )}
                                        {unit.status === "hold" && (
                                          <>
                                            <button
                                              className="available-unit"
                                              style={{
                                                backgroundColor: "#A6FFBF",
                                              }}
                                              onClick={() =>
                                                handleMarkUnitAvailable(
                                                  project._id,
                                                  block._id,
                                                  unit._id
                                                )
                                              }
                                            >
                                              {" "}
                                              Available
                                            </button>
                                            <button
                                              className="sold-unit"
                                              onClick={() =>
                                                handleMarkUnitSold(
                                                  project._id,
                                                  block._id,
                                                  unit._id
                                                )
                                              }
                                            >
                                              {" "}
                                              Sold
                                            </button>
                                          </>
                                        )}
                                        {unit.status === "available" && (
                                          <>
                                            <button
                                              className="hold-unit"
                                              onClick={() =>
                                                handleMarkUnitHold(
                                                  project._id,
                                                  block._id,
                                                  unit._id
                                                )
                                              }
                                            >
                                              Hold
                                            </button>
                                            <button
                                              className="sold-unit"
                                              onClick={() =>
                                                handleMarkUnitSold(
                                                  project._id,
                                                  block._id,
                                                  unit._id
                                                )
                                              }
                                            >
                                              {" "}
                                              Sold
                                            </button>
                                          </>
                                        )}
                                        <button
                                          className="delete-unit"
                                          onClick={() =>
                                            handleDeleteUnit(
                                              project._id,
                                              block._id,
                                              unit._id
                                            )
                                          }
                                        >
                                          {" "}
                                          Delete
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </ul>
                          </>
                        )}
                      </div>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
export default UploadedProjects;
import axios from "axios";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faLocationDot, faTimes,} from "@fortawesome/free-solid-svg-icons";
import UserSidebar from "../../Sidebar/UserSidebar";
const UserDashBoard = ({ userData }) => {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedBlockId, setSelectedBlockId] = useState("null");
  const [showBlocks, setShowBlocks] = useState(true);
  const [showUnits, setShowUnits] = useState(true);
  const [totalUnitsCount, setTotalUnitsCount] = useState(0);
  const [blockwiseUnitCounts, setBlockwiseUnitCounts] = useState({});
  const [totalHoldUnitsCount, setTotalHoldUnitsCount] = useState(0);
  const [blockwiseHoldUnitCounts, setBlockwiseHoldUnitCounts] = useState({});
  const [totalSoldUnitsCount, setTotalSoldUnitsCount] = useState(0);
  const [blockwiseSoldUnitCounts, setBlockwiseSoldUnitCounts] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [totalAvailableUnitsCount, setTotalAvailableUnitsCount] = useState(0);
  const [blockwiseAvailableUnitCounts, setBlockwiseAvailableUnitCounts] =
    useState({});
  const [projectUnitCounts, setProjectUnitCounts] = useState({});
  const [UnitDropdown, setUnitDropdown] = useState(null);
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
    setTotalUnitsCount(totalUnits);
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
    setTotalHoldUnitsCount(totalHoldUnits);
    setBlockwiseHoldUnitCounts(blockwiseHoldCounts);
  };
  useEffect(() => {
    fetchProjects();
  }, []);
  useEffect(() => {
    updateUnitCounts();
    updateTotalUnitsCount();
    updateHoldUnitCounts();
    updateSoldUnitCounts();
    updateProjectUnitCounts();
  }, [projects]);
  const closeModal = () => {
    const body = document.querySelector("body");
    const modalWrapper = document.querySelector(".modal-wrapper");
    modalWrapper.style.display = "none";
    body.style.overflow = "auto";
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

    setTotalUnitsCount(totalUnits);
    setTotalAvailableUnitsCount(totalAvailableUnits);
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
    setTotalSoldUnitsCount(totalSoldUnits);
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
  const handleMarkUnitHold = async (projectId, blockId, unitId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to mark this unit as hold?"
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
  return (
    <div>
      <UserSidebar/>
      {/* <div className="main-content">
        <p className="user-profile">
          HELLO, {userData.fname && userData.fname.toUpperCase()}
        </p>
        <div className="projects-grid ">
          {projects.map((project, index) => (
            <div key={index} className="position-relative">
              <div className=" projectdiv">
                <div className="coloureddiv1">
                  <h3 className="colouredtext">{project.name}</h3>
                </div>
                <div className="coloureddiv">
                  <p className="descriptiondiv">
                    {project.description}{" "}
                    <FontAwesomeIcon icon={faLocationDot} />
                  </p>
                </div>
                <div
                  className="viewdetail-div"
                  onClick={() => handleClickProject(project._id)}
                >
                  <div
                    className="viewbutton-div"
                    onClick={() => handleClickProject(project._id)}
                  >
                    <p className="moredetail-text mt-3">View More Details</p>
                    <FontAwesomeIcon icon={faCaretDown} />
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
                    <div className="d-flex justify-content-between">
                      <div className="totalunitsdiv mt-3">
                        <h2 className="textunits"> Total </h2>
                        <p className="unitsnum">
                          {" "}
                          {projectUnitCounts[project._id]?.totalUnits || 0}
                        </p>
                      </div>
                      <div className="availableunitsdiv mt-3">
                        <h2 className="textunits"> Available </h2>
                        <p className="unitsnum">
                          {" "}
                          {projectUnitCounts[project._id]
                            ?.totalAvailableUnits || 0}
                        </p>
                      </div>
                      <div className="holunitsdiv mt-3">
                        <h2 className="textunits"> Hold </h2>
                        <p className="unitsnum">
                          {" "}
                          {projectUnitCounts[project._id]?.totalHoldUnits || 0}
                        </p>
                      </div>
                      <div className="solunitsdiv mt-3">
                        <h2 className="textunits"> Sold </h2>
                        <p className="unitsnum">
                          {" "}
                          {projectUnitCounts[project._id]?.totalSoldUnits || 0}
                        </p>
                      </div>
                    </div>
                    <h4 className="mainhead">Blocks:</h4>
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
                        <div className=" " key={blockIndex}>
                          {selectedBlockId === block._id && showUnits && (
                            <>
                              <ul>
                                <div className="row">
                                  {block.units.map((unit, unitIndex) => (
                                    <div className="col-2" key={unitIndex}>
                                      <div
                                        className="units-div "
                                        style={{
                                          backgroundColor:
                                            unit.status === "hold"
                                              ? "#FEE69F"
                                              : unit.status === "sold"
                                              ? "#FE8B8B"
                                              : "#A6FFBF",
                                        }}
                                        onClick={() =>
                                          DropdownToggle(unitIndex)
                                        }
                                      >
                                        <p className="unit-div">{unit.name}</p>
                                      </div>
                                      {UnitDropdown === unitIndex && (
                                        <div className=" ">
                                          {unit.status === "available" && (
                                            <button
                                              className="hold-unit mt-2 "
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
                                          )}
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
      </div> */}
    </div>
  );
};
export default UserDashBoard;

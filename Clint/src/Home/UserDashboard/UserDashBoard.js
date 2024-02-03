import axios from 'axios';
import React, { useState, useEffect } from "react";

const UserDashBoard = ({ userData }) => {

  const [projects, setProjects] = useState([]);
  const [newBlockName, setNewBlockName] = useState("");
  const [newUnitName, setNewUnitName] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedBlockId, setSelectedBlockId] = useState("");
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
  const [blockwiseAvailableUnitCounts, setBlockwiseAvailableUnitCounts] = useState({});
  const [projectUnitCounts, setProjectUnitCounts] = useState({});

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
  const handleMarkUnitSold = async (projectId, blockId, unitId) => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/markUnitSold/${projectId}/${blockId}/${unitId}`);
      const data = response.data;
      if (response.status === 200 && data.status === "ok") {
        fetchProjects(); // Update projects after successfully marking unit as sold
        alert("Unit marked as sold successfully");
      } else {
        console.error("Failed to mark unit as sold:", data.error);
      }
    } catch (error) {
      console.error("Error marking unit as sold:", error);
    }
  };
  const updateHoldUnitCounts = () => {
    let totalHoldUnits = 0;
    let blockwiseHoldCounts = {};

    projects.forEach((project) => {
      project.blocks.forEach((block) => {
        const holdUnits = block.units.filter(unit => unit.status === "hold");
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

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };
  const updateTotalUnitsCount = () => {
    let totalUnits = 0;
    let totalAvailableUnits = 0;
    let blockwiseAvailableCounts = {};

    projects.forEach((project) => {
      project.blocks.forEach((block) => {
        const availableUnits = block.units.filter(unit => unit.status !== "hold" && unit.status !== "sold");
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
        const soldUnits = block.units.filter(unit => unit.status === "sold");
        totalSoldUnits += soldUnits.length;
        blockwiseSoldCounts[block._id] = soldUnits.length;
      });
    });

    setTotalSoldUnitsCount(totalSoldUnits);
    setBlockwiseSoldUnitCounts(blockwiseSoldCounts);
  };
  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/getAllProjects`);
      const data = response.data;
      if (response.status === 200 && data.status === "ok") {
        const projectsWithUnitCount = await Promise.all(data.data.map(async project => {
          const blocksWithUnitCount = await Promise.all(project.blocks.map(async block => {
            const unitCount = await getUnitCount(project._id, block._id);
            return { ...block, unitCount };
          }));
          return { ...project, blocks: blocksWithUnitCount };
        }));

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

  const handleAddBlock = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/addBlock/${selectedProjectId}`, {
        name: newBlockName
      });
      const data = response.data;
      if (response.status === 201 && data.status === "ok") {
        fetchProjects();
        setNewBlockName("");
      } else {
        console.error("Failed to add block:", data.error);
      }
    } catch (error) {
      console.error("Error adding block:", error);
    }
  };

  const handleAddUnit = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/addUnit/${selectedProjectId}/${selectedBlockId}`, {
        name: newUnitName
      });
      const data = response.data;
      if (response.status === 201 && data.status === "ok") {
        fetchProjects();
        setNewUnitName("");
      } else {
        console.error("Failed to add unit:", data.error);
      }
    } catch (error) {
      console.error("Error adding unit:", error);
    }
  };

  const handleMarkUnitHold = async (projectId, blockId, unitId) => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/markUnitHold/${projectId}/${blockId}/${unitId}`);
      const data = response.data;
      if (response.status === 200 && data.status === "ok") {
        fetchProjects(); // Update projects after successfully marking unit as hold
        alert("Unit marked as hold successfully");
      } else {
        console.error("Failed to mark unit as hold:", data.error);
      }
    } catch (error) {
      console.error("Error marking unit as hold:", error);
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
    setSelectedBlockId(""); // Reset selected block when project is clicked
    setShowBlocks(!showBlocks); // Toggle showing blocks
    setShowUnits(true); // Reset showing units
  };

  const handleClickBlock = (blockId) => {
    setSelectedBlockId(blockId);
    setShowUnits(!showUnits); // Toggle showing units
  };

  const handleDeleteUnit = async (projectId, blockId, unitId) => {
    try {
      const response = await axios.delete(`${process.env.REACT_APP_API_URL}/deleteUnit/${projectId}/${blockId}/${unitId}`);
      const data = response.data;
      if (response.status === 200 && data.status === "ok") {
        fetchProjects();
      } else {
        console.error("Failed to delete unit:", data.error);
      }
    } catch (error) {
      console.error("Error deleting unit:", error);
    }
  };

  const handleDeleteBlock = async (projectId, blockId) => {
    try {
      const response = await axios.delete(`${process.env.REACT_APP_API_URL}/deleteBlock/${projectId}/${blockId}`);
      const data = response.data;
      if (response.status === 200 && data.status === "ok") {
        fetchProjects();
      } else {
        console.error("Failed to delete block:", data.error);
      }
    } catch (error) {
      console.error("Error deleting block:", error);
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      const response = await axios.delete(`${process.env.REACT_APP_API_URL}/deleteProject/${projectId}`);
      const data = response.data;
      if (response.status === 200 && data.status === "ok") {
        fetchProjects();
      } else {
        console.error("Failed to delete project:", data.error);
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };
  return (
    <div className="main-content">
      <h2 className="">Our Projects</h2>
      <div className="d-flex flex-wrap">
        {projects.map((project, index) => (
          <div key={index} className=" mb-5 position-relative">
            <div className="d-flex projectdiv justify-content-around ms-5" onClick={() => handleClickProject(project._id)}>
              <div className="coloureddiv">
                <p>Total Units: {projectUnitCounts[project._id]?.totalUnits || 0}</p>
                <p>Available Units: {projectUnitCounts[project._id]?.totalAvailableUnits || 0}</p>
                <p>Hold Units: {projectUnitCounts[project._id]?.totalHoldUnits || 0}</p>
                <p>Sold Units: {projectUnitCounts[project._id]?.totalSoldUnits || 0}</p>
              </div>
              <div className="coloureddiv1">
                <h3 className="colouredtext">{project.name}</h3>
                <p className="descriptiondiv">{project.description}</p>
              </div>
            </div>
            {selectedProjectId === project._id && showBlocks && (
              <div className={`showModal ${showModal ? 'visible' : 'hidden'}`}>
                <div>
                  <div className="d-flex justify-content-between">
                    <div className="totalunitsdiv mt-3">
                      <h2 className="textunits"> Total </h2>
                      <p className="unitsnum"> {projectUnitCounts[project._id]?.totalUnits || 0}</p>
                    </div>
                    <div className="availableunitsdiv mt-3">
                      <h2 className="textunits"> Availabe </h2>
                      <p className="unitsnum"> {projectUnitCounts[project._id]?.totalAvailableUnits || 0}</p>
                    </div>
                    <div className="holunitsdiv mt-3">
                      <h2 className="textunits"> Hold </h2>
                      <p className="unitsnum"> {projectUnitCounts[project._id]?.totalHoldUnits || 0}</p>
                    </div>
                    <div className="solunitsdiv mt-3">
                      <h2 className="textunits"> Sold </h2>
                      <p className="unitsnum"> {projectUnitCounts[project._id]?.totalSoldUnits || 0}</p>
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
                        <tr key={blockIndex} onClick={() => handleClickBlock(block._id)}>
                          <td>{blockIndex + 1}</td>
                          <td>{block.name}</td>
                          <td>{blockwiseUnitCounts[block._id]}</td>
                          <td>{blockwiseAvailableUnitCounts[block._id]}</td>
                          <td>{blockwiseHoldUnitCounts[block._id] || 0}</td>
                          <td>{blockwiseSoldUnitCounts[block._id] || 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <ul>
                    {project.blocks.map((block, blockIndex) => (

                      <li key={blockIndex} onClick={() => handleClickBlock(block._id)}>
                        <p className="mainhead">{block.name} (Unit count: {block.units.length}, Hold count: {blockwiseHoldUnitCounts[block._id] || 0})</p>
                        {selectedBlockId === block._id && showUnits && (
                          <>
                            <h5 className="mainhead">Units:</h5>
                            <ul>
                              {block.units.map((unit, unitIndex) => (
                                <li key={unitIndex} style={{ color: unit.status === "hold" ? "yellow" : unit.status === "sold" ? "red" : "green" }}>
                                  <p className="mainhead">{unit.name}</p>
                                  <button onClick={() => handleMarkUnitHold(project._id, block._id, unit._id)}>Mark as Hold</button>
                                  <button onClick={() => handleMarkUnitSold(project._id, block._id, unit._id)}>Mark as Sold</button>
                                  <button onClick={() => handleDeleteUnit(project._id, block._id, unit._id)}>Delete Unit</button>
                                </li>
                              ))}
                            </ul>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                  <div>
                    <input type="text" value={newBlockName} onChange={(e) => setNewBlockName(e.target.value)} />
                    <button onClick={handleAddBlock}>Add Block</button>
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

export default UserDashBoard
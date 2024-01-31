import React, { useState, useEffect } from "react";
import axios from 'axios';
import Blocks from "./Uploads/Blocks";

const UploadedProjects = () => {
  const [projects, setProjects] = useState([]);
  const [newBlockName, setNewBlockName] = useState("");
  const [newUnitName, setNewUnitName] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedBlockId, setSelectedBlockId] = useState("");
  const [showBlocks, setShowBlocks] = useState(true);
  const [showUnits, setShowUnits] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/getAllProjects`);
      const data = response.data;
      if (response.status === 200 && data.status === "ok") {
        setProjects(data.data);
      } else {
        console.error("Failed to fetch projects:", data.error);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
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
        fetchProjects();
      } else {
        console.error("Failed to mark unit as hold:", data.error);
      }
    } catch (error) {
      console.error("Error marking unit as hold:", error);
    }
  };

  const handleMarkUnitSold = async (projectId, blockId, unitId) => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/markUnitSold/${projectId}/${blockId}/${unitId}`);
      const data = response.data;
      if (response.status === 200 && data.status === "ok") {
        fetchProjects();
      } else {
        console.error("Failed to mark unit as sold:", data.error);
      }
    } catch (error) {
      console.error("Error marking unit as sold:", error);
    }
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
    <div className="container">
      <h2>Uploaded Projects</h2>
      <ul>
        {projects.map((project, index) => (
          <li key={index}>
            <h3 onClick={() => handleClickProject(project._id)}>{project.name}</h3>
            {selectedProjectId === project._id && showBlocks && (
              <>
                <p>{project.description}</p>
                <div>
                  <h4>Blocks:</h4>
                  <ul>
                    {project.blocks.map((block, blockIndex) => (
                      <li key={blockIndex} onClick={() => handleClickBlock(block._id)}>
                         <button onClick={() => handleDeleteBlock(project._id, Blocks._id)}>Delete Block</button>
                        <p>{block.name}</p>
                        {selectedBlockId === block._id && showUnits && (
                          <>
                            <h5>Units:</h5>
                            <ul>
                              {block.units.map((unit, unitIndex) => (
                                <li key={unitIndex} style={{ color: unit.status === "hold" ? "yellow" : unit.status === "sold" ? "red" : "inherit" }}>
                                  <p>{unit.name}</p>
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
              </>
            )}
          </li>
        ))}
      </ul>
      <div>
        <input type="text" value={newUnitName} onChange={(e) => setNewUnitName(e.target.value)} />
        <select onChange={(e) => setSelectedProjectId(e.target.value)}>
          <option value="">Select Project</option>
          {projects.map((project, index) => (
            <option key={index} value={project._id}>{project.name}</option>
          ))}
        </select>
        <select onChange={(e) => setSelectedBlockId(e.target.value)}>
          <option value="">Select Block</option>
          {projects.map((project, index) => (
            project.blocks.map((block, blockIndex) => (
              <option key={blockIndex} value={block._id}>{block.name}</option>
            ))
          ))}
        </select>
        <button onClick={handleAddUnit}>Add Unit</button>
        <button onClick={() => handleDeleteProject(selectedProjectId)}>Delete Project</button>

      </div>
    </div>
  );
};

export default UploadedProjects;

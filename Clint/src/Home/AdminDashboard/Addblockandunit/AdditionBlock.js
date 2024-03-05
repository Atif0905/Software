import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdditionBlock = () => {
  const [totalPlotInBlock, setTotalPlotInBlock] = useState("");
  const [plotSize, setPlotSize] = useState("");
  const [basicRateOfBlock, setBasicRateOfBlock] = useState("");
  const [idcRateOfBlock, setIdcRateOfBlock] = useState("");
  const [edcRateOfBlock, setEdcRateOfBlock] = useState("");
  const [newBlockName, setNewBlockName] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [projects, setProjects] = useState([]);

  const handleAddBlock = async (e) => {
    e.preventDefault();

    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/addBlock/${selectedProjectId}`,
      {
        name: newBlockName,
        totalPlotInBlock,
        plotSize,
        basicRateOfBlock,
        idcRateOfBlock,
        edcRateOfBlock,
      }
    );
    const data = response.data;
    if (response.status === 201 && data.status === "ok") {
      fetchProjects();
      setNewBlockName("");
      setTotalPlotInBlock("");
      setPlotSize("");
      setBasicRateOfBlock("");
      setIdcRateOfBlock("");
      setEdcRateOfBlock("");
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

  useEffect(() => {
    fetchProjects();
  }, []);

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

  return (
    <div className="main-content back">
      <h4 className='Headtext'>Add Block</h4>
      <div className='col-6 whiteback'>
        <form onSubmit={handleAddBlock}>
          <div>
            <label>Select Project</label>
            <select
              className="select-buttons ps-1"
              onChange={(e) => setSelectedProjectId(e.target.value)}
            >
              <option value="">Select Project</option>
              {projects.map((project, index) => (
                <option key={index} value={project._id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
          <div className='mt-2'>
            <label className=''>Block name</label>
            <input type="text" className="form-input-field" placeholder="Block Name" value={newBlockName} onChange={(e) => setNewBlockName(e.target.value.toUpperCase())} />
          </div>
          <label className='mt-2'>Total Plot </label>
          <input
            type="number"
            className="form-input-field "
            placeholder="Total Plot in Block"
            value={totalPlotInBlock}
            onChange={(e) => setTotalPlotInBlock(e.target.value)}
            required
          />
          <div className='mt-2'>
            <label className=''>Plot Size</label>
            <input
              type="number"
              className="form-input-field"
              placeholder="Plot Size (sqyd)"
              value={plotSize}
              onChange={(e) => setPlotSize(e.target.value)}
              required
            />
          </div>
          <div className='mt-2'>
            <label className=''>Basic Rate</label>
            <input
              type="number"
              className="form-input-field"
              placeholder="Basic Rate of Block"
              value={basicRateOfBlock}
              onChange={(e) => setBasicRateOfBlock(e.target.value)}
              required
            />
          </div>
          <div className='mt-2'>
            <label className=''>IDC Rate</label>
            <input
              type="number"
              className="form-input-field "
              placeholder="IDC rate of Block"
              value={idcRateOfBlock}
              onChange={(e) => setIdcRateOfBlock(e.target.value)}
              required
            />
          </div>
          <div className='mt-2'>
            <label className=''>EDC Rate</label>
            <input
              type="number"
              className="form-input-field "
              placeholder="EDC Rate of Block"
              value={edcRateOfBlock}
              onChange={(e) => setEdcRateOfBlock(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="add-buttons mt-3"
          >
            Add Block
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdditionBlock;

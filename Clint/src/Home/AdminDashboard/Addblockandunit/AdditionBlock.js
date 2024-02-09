import React ,{useState}from 'react'
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

  const handleAddBlock = async () => {
    const isConfirmed = window.confirm("Are you sure you want to add this block?");
    if (isConfirmed) {
      try {
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
          // Fetch projects to update the project list
          fetchProjects();
          
          // Reset input field values
          setNewBlockName("");
          setTotalPlotInBlock("");
          setPlotSize("");
          setBasicRateOfBlock("");
          setIdcRateOfBlock("");
          setEdcRateOfBlock("");
          
          // Log success message
          console.log("Block added successfully");
        } else {
          console.error("Failed to add block:", data.error);
        }
      } catch (error) {
        console.error("Error adding block:", error);
      }
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
  return (
    <div className="">
    <input
      type="number"
      className="form-input-field mt-4"
      placeholder="Total Plot in Block"
      value={totalPlotInBlock}
      onChange={(e) => setTotalPlotInBlock(e.target.value)}
      required
    />
    <div><input
      type="number"
      className="form-input-field mt-4"
      placeholder="Plot Size (sqyd)"
      value={plotSize}
      onChange={(e) => setPlotSize(e.target.value)}
      required
    /></div>
    <div><input
      type="number"
      className="form-input-field mt-4"
      placeholder="Basic Rate of Block"
      value={basicRateOfBlock}
      onChange={(e) => setBasicRateOfBlock(e.target.value)}
      required
    /></div>
    <div><input
      type="number"
      className="form-input-field mt-4"
      placeholder="IDC rate of Block"
      value={idcRateOfBlock}
      onChange={(e) => setIdcRateOfBlock(e.target.value)}
      required
    /></div>
    <div><input type="number" className="form-input-field mt-4" placeholder="EDC Rate of Block" value={edcRateOfBlock}  onChange={(e) => setEdcRateOfBlock(e.target.value)} required/></div>
    <div><input type="text" className="form-input-field mt-4" placeholder="Block Name" value={newBlockName} onChange={(e) => setNewBlockName(e.target.value)}/></div>
    <div><select
              className="select-buttons mt-3 ps-1"
              onChange={(e) => setSelectedProjectId(e.target.value)}
            >
      <option value="">Select Project</option>
      {projects.map((project, index) => (
        <option key={index} value={project._id}>
          {project.name}
        </option>
      ))}
    </select></div>
    <button
      className="add-buttons mt-3"
      onClick={handleAddBlock}
      disabled={!newBlockName.trim()}
    >
      Add Block
    </button></div>
  )
}

export default AdditionBlock
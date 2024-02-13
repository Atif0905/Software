import React, {useState, useEffect} from 'react'
import axios from 'axios';

const AdditionUnit = () => {
    const [projects, setProjects] = useState([]);
    const [showUnitDropdown, setShowUnitDropdown] = useState(false);
  const [plotSize, setPlotSize] = useState("");
  const [sizeType, setSizeType] = useState("");
  const [rate, setRate] = useState("");
  const [idcCharges, setIdcCharges] = useState("");
  const [plcCharges, setPlcCharges] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [newUnitName, setNewUnitName] = useState("");
  const [selectedBlockId, setSelectedBlockId] = useState("null");
  const handleAddUnit = async () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to add this unit?"
    );
  
    if (isConfirmed) {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/addUnit/${selectedProjectId}/${selectedBlockId}`,
          {
            name: newUnitName,
            plotSize,
            sizeType, // Assuming sizeType is selected from options (sqft or sqyd)
            rate,
            idcCharges,
            plcCharges
          }
        );
  
        const data = response.data;
        
        if (response.status === 201 && data.status === "ok") {
          fetchProjects();
          setNewUnitName("");
          setPlotSize("");
          setSizeType("");
          setRate("");
          setIdcCharges("");
          setPlcCharges("");
        } else {
          console.error("Failed to add unit:", data.error);
        }
      } catch (error) {
        console.error("Error adding unit:", error);
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
      const handleDeleteProject = async (projectId) => {
        // Check if a project is selected
        if (!projectId) {
          console.error("No project selected.");
          return;
        }
    
        const isConfirmed = window.confirm(
          "Are you sure you want to delete this project?"
        );
        if (isConfirmed) {
          try {
            const response = await axios.delete(
              `${process.env.REACT_APP_API_URL}/deleteProject/${projectId}`
            );
            const data = response.data;
            if (response.status === 200 && data.status === "ok") {
              fetchProjects();
            } else {
              console.error("Failed to delete project:", data.error);
            }
          } catch (error) {
            console.error("Error deleting project:", error);
          }
        }
      };
      const handleClickBlock = (blockId) => {
        setSelectedBlockId((prevId) => (prevId === blockId ? null : blockId));
      };
      const handleClickProject = (projectId) => {
        // setSelectedProjectId(projectId);
        setSelectedBlockId("null"); 
        // setShowBlocks(!showBlocks); 
        // setShowUnits(true); 
      };
      useEffect(() => {
        fetchProjects();
      }, []);
  return (
    <div className="main-content"> 
    <h2> Add Unit</h2>
<div><input type="text" className="form-input-field mt-4" placeholder="Unit Name" value={newUnitName} onChange={(e) => setNewUnitName(e.target.value.toUpperCase())} required /></div>
<div><input  type="number" className="form-input-field mt-4" placeholder="Plot Size" value={plotSize} onChange={(e) => setPlotSize(e.target.value)} required/></div>
<div><input type="number" className="form-input-field mt-4"  placeholder="Rate" value={rate} onChange={(e) => setRate(e.target.value)} required/></div>
<div><input type="number" className="form-input-field mt-4" placeholder="IDC Charges" value={idcCharges} onChange={(e) => setIdcCharges(e.target.value)} required/></div>
<div><input type="number" className="form-input-field mt-4" placeholder="PLC Charges" value={plcCharges} onChange={(e) => setPlcCharges(e.target.value)}  required/></div>
<div className="mt-3"><select className="select-buttons ps-1" onChange={(e) => setSelectedProjectId(e.target.value)} >
  <option value="">Select Project</option>
  {projects.map((project, index) => ( <option key={index} value={project._id}> {project.name} </option>
  ))}
</select></div>

<div className="mt-3"><select className="select-buttons ps-1" value={sizeType} onChange={(e) => setSizeType(e.target.value)}>
<option value="">Select Size Type</option>
<option value="sqft">sqft</option>
<option value="sqyd">sqyd</option>
</select></div>
<div className="mt-3"><select className="select-buttons  ps-1" onChange={(e) => setSelectedBlockId(e.target.value)}>
  <option value="">Select Block</option>
  {selectedProjectId && projects.find((project) => project._id === selectedProjectId) ?.blocks.map((block, index) => ( <option key={index} value={block._id}> {block.name} </option>))}
</select></div>
<div className="mt-3"><button className="add-buttons" onClick={handleAddUnit} disabled={!newUnitName.trim()} >
  Add Unit
</button></div>
<button className="delete-buttons mt-3" onClick={() => handleDeleteProject(selectedProjectId)} > Delete Project </button>
</div>
  )
}

export default AdditionUnit
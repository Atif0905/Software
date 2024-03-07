import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
const Blocks = () => {
  const { projectId, blockId } = useParams();
  const [project, setProject] = useState(null);
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/project/${projectId}`);
        const data = response.data;
        if (response.status === 200 && data.status === "ok") {
          const block = data.data.blocks.find(block => block._id === blockId);
          setProject({ ...data.data, block });
        } else {
          console.error("Failed to fetch project:", data.error);
        }
      } catch (error) {
        console.error("Error fetching project:", error);
      }
    };
    fetchProject();
  }, [projectId, blockId]);
  if (!project) {
    return <div>Loading...</div>;
  }
  return (
    <div className="container">
      <h2>Project: {project.name}</h2>
      <h3>Block: {project.block.name}</h3>
      <p>Description: {project.description}</p>
      <h4>Units:</h4>
      <ul>
        {project.block.units.map((unit, index) => (
          <li key={index}>{unit.name}</li>
        ))}
      </ul>
    </div>
  );
}
export default Blocks
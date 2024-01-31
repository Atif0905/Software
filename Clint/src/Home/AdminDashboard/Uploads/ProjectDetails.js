import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ProjectDetails = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    fetchProject(projectId);
  }, [projectId]);

  const fetchProject = async (projectId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/getProject/${projectId}`);
      const data = response.data;
      if (response.status === 200 && data.status === "ok") {
        setProject(data.data);
      } else {
        console.error("Failed to fetch project:", data.error);
      }
    } catch (error) {
      console.error("Error fetching project:", error);
    }
  };

  return (
    <div>
      {project && (
        <>
          <h3>{project.name}</h3>
          <p>{project.description}</p>
          {/* Display blocks and units here */}
          <div>
            <h4>Blocks:</h4>
            <ul>
              {project.blocks.map((block, index) => (
                <li key={index}>
                  <p>{block.name}</p>
                  <ul>
                    {block.units.map((unit, unitIndex) => (
                      <li key={unitIndex}>
                        <p>{unit.name}</p>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default ProjectDetails;

import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../../Confirmation/Loader";
import useFetchUser from "../../hooks/useFetchUser";

const UserDashBoard = () => {
  const [projects, setProjects] = useState([]);
  const [expandedProjectId, setExpandedProjectId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [clickedUnits, setClickedUnits] = useState({});
  const { user, loading: userLoading } = useFetchUser();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/getAllProjects`
        );
        const data = response.data;
        if (response.status === 200 && data.status === "ok") {
          const projectsWithAvailableUnits = data.data.map((project) => {
            const filteredBlocks = project.blocks.map((block) => ({
              ...block,
              units: block.units.filter((unit) => unit.status === "available"),
            }));
            return { ...project, blocks: filteredBlocks };
          });
          setProjects(projectsWithAvailableUnits);
        } else {
          console.error("Failed to fetch projects:", data.error);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();

    // Load click timestamps from local storage
    const storedClicks = JSON.parse(localStorage.getItem("clickedUnits")) || {};
    setClickedUnits(storedClicks);
  }, []);

  const handleProjectClick = (projectId) => {
    setExpandedProjectId((prev) => (prev === projectId ? null : projectId));
  };

  const handleUnitClick = async (unit, block, project) => {
    const unitKey = `${unit._id}-${block._id}-${project._id}`;
    const now = new Date().getTime();

    // Save the click and disable the button immediately
    setClickedUnits((prev) => {
      const updatedClicks = { ...prev, [unitKey]: now };
      localStorage.setItem("clickedUnits", JSON.stringify(updatedClicks));
      return updatedClicks;
    });

    const requestData = {
      unit_id: unit._id,
      block_id: block._id,
      project_id: project._id,
      user_id: user._id,
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/createRequest`,
        requestData
      );
    } catch (error) {
      console.error("Error creating request:", error);
    }
  };

  const isUnitPending = (unit, block, project) => {
    const unitKey = `${unit._id}-${block._id}-${project._id}`;
    const lastClicked = clickedUnits[unitKey];
    return lastClicked && new Date().getTime() - lastClicked < 24 * 60 * 60 * 1000;
  };

  return (
    <div className="main-content">
      {loading && <Loader />}
      <div className="formback1">
        <h2 className="formhead">Dashboard</h2>
        <div className="p-2">
          <table className="unit-table">
            <thead>
              <tr>
                <td>Project Name</td>
                <td>Available Units</td>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => {
                const totalAvailableUnits = project.blocks.reduce(
                  (sum, block) => sum + block.units.length,
                  0
                );
                return (
                  <React.Fragment key={project._id}>
                    <tr onClick={() => handleProjectClick(project._id)}>
                      <td className="tablecursor">
                        {project.name.toUpperCase()}
                      </td>
                      <td className="tablecursor">{totalAvailableUnits}</td>
                    </tr>
                    {expandedProjectId === project._id && (
                      <React.Fragment>
                        <tr>
                          <th>Block Name</th>
                          <th>Unit Name</th>
                          <th>Action</th>
                        </tr>
                        {project.blocks.map((block) =>
                          block.units.map((unit) => (
                            <tr key={unit._id}>
                              <td>
                                <strong>{block.name}</strong>
                              </td>
                              <td>{unit.name}</td>
                              <td>
                                <button
                                  className="hold-button"
                                  onClick={() => handleUnitClick(unit, block, project)}
                                  disabled={isUnitPending(unit, block, project)}
                                >
                                  {isUnitPending(unit, block, project)
                                    ? "Pending"
                                    : "Hold"}
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </React.Fragment>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserDashBoard;

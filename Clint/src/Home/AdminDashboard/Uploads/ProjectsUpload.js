import React, { useState, useEffect } from "react";
import axios from "axios";
import '../AdminDashboard.css'

const ProjectsUpload = () => {
  const [projects, setProjects] = useState([]);
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
    <div className="container">
      <h4>Payment Blocks</h4>
      <div className=" mb-3 flexy ">
      <div className="paymentmaindiv">
  <div className="coloureddiv1">
    <h3 className="colouredtext">Total Payment</h3>
  </div>
  <div className="coloureddiv">
    <p className="descriptiondiv"> </p>
  </div>
  <div className="view-paymentdiv"  >
  <div className=" view-paymentbutton-div">
  <p className="moredetail-text mt-3">View More Details</p>
</div>
  </div>
</div>
<div className="paymentmaindiv">
  <div className="coloureddiv1">
    <h3 className="colouredtext">Recieved Payment</h3>
  </div>
  <div className="coloureddiv">
    <p className="descriptiondiv"> </p>
  </div>
  <div className="view-paymentdiv"  >
  <div className=" view-paymentbutton-div">
  <p className="moredetail-text mt-3">View More Details</p>
</div>
  </div>
</div>
<div className="paymentmaindiv">
  <div className="coloureddiv1">
    <h3 className="colouredtext">Due Payment</h3>
  </div>
  <div className="coloureddiv">
    <p className="descriptiondiv"> </p>
  </div>
  <div className="view-paymentdiv"  >
  <div className=" view-paymentbutton-div">
  <p className="moredetail-text mt-3">View More Details</p>
</div>
  </div>
</div>
</div>
      </div>
  );
};

export default ProjectsUpload;

import React, { useState, useEffect } from "react";
import axios from "axios";
// import Blocks from "./Blocks";
import "../../../UpdateProjects/Projects.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faLocationDot, faArrowDown, faArrowUp   } from "@fortawesome/free-solid-svg-icons";
import Projects from "../../../UpdateProjects/Projects";
import User from "../../../User/AdminUser";
import AdditionBlock from "../Addblockandunit/AdditionBlock";
import AdditionUnit from "../Addblockandunit/AdditionUnit";

const ProjectsUpload = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedBlockId, setSelectedBlockId] = useState("null");
  const [showBlocks, setShowBlocks] = useState(true);
  const [showUnits, setShowUnits] = useState(true);
  // const [totalUnitsCount, setTotalUnitsCount] = useState(0);
  const [blockwiseUnitCounts, setBlockwiseUnitCounts] = useState({});
  // const [totalHoldUnitsCount, setTotalHoldUnitsCount] = useState(0);
  const [blockwiseHoldUnitCounts, setBlockwiseHoldUnitCounts] = useState({});
  // const [totalSoldUnitsCount, setTotalSoldUnitsCount] = useState(0);
  const [blockwiseSoldUnitCounts, setBlockwiseSoldUnitCounts] = useState({});
  const [showModal, setShowModal] = useState(false);
  // const [totalAvailableUnitsCount, setTotalAvailableUnitsCount] = useState(0);
  const [blockwiseAvailableUnitCounts, setBlockwiseAvailableUnitCounts] =
    useState({});
  const [projectUnitCounts, setProjectUnitCounts] = useState({});
  const [UnitDropdown, setUnitDropdown] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showProjectsDropdown, setShowProjectsDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showBlockDropdown, setShowBlockDropdown] = useState(false);
  const [showUnitDropdown, setShowUnitDropdown] = useState(false);

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

    // setTotalUnitsCount(totalUnits);
    setBlockwiseUnitCounts(blockCounts);
  };
  
  const handleMarkUnitSold = async (projectId, blockId, unitId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to mark this unit as Sold?"
    );
    if (isConfirmed) {
      try {
        const response = await axios.put(
          `${process.env.REACT_APP_API_URL}/markUnitSold/${projectId}/${blockId}/${unitId}`
        );
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
    }
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

    // setTotalHoldUnitsCount(totalHoldUnits);
    setBlockwiseHoldUnitCounts(blockwiseHoldCounts);
  };

  useEffect(() => {
    updateUnitCounts();
    updateTotalUnitsCount();
    updateHoldUnitCounts();
    updateSoldUnitCounts();
    updateProjectUnitCounts();
  }, [projects]);
  const handleMarkUnitHold = async (projectId, blockId, unitId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to mark this unit as Hold?"
    );

    if (isConfirmed) {
      try {
        const response = await axios.put(
          `${process.env.REACT_APP_API_URL}/markUnitHold/${projectId}/${blockId}/${unitId}`
        );
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
    }
  };

  const updateTotalUnitsCount = () => {
    let totalUnits = 0;
    // let totalAvailableUnits = 0;
    let blockwiseAvailableCounts = {};

    projects.forEach((project) => {
      project.blocks.forEach((block) => {
        const availableUnits = block.units.filter(
          (unit) => unit.status !== "hold" && unit.status !== "sold"
        );
        // totalAvailableUnits += availableUnits.length;
        blockwiseAvailableCounts[block._id] = availableUnits.length;

        totalUnits += block.units.length;
      });
    });

    // setTotalUnitsCount(totalUnits);
    // setTotalAvailableUnitsCount(totalAvailableUnits);
    setBlockwiseAvailableUnitCounts(blockwiseAvailableCounts);
  };
  // const toggleDropdown = (dropdown) => {
  //   setShowProjectsDropdown(false);
  //   setShowUserDropdown(false);

  //   if (dropdownOpen === dropdown) {
  //     setDropdownOpen(null); // Close the clicked dropdown if it's already open
  //   } else {
  //     setDropdownOpen(dropdown); // Open the clicked dropdown
  //   }
  // };

  const toggleProjectsDropdown = () => {
    setDropdownOpen(null);
    setShowUserDropdown(false);
    setShowProjectsDropdown(!showProjectsDropdown);
  };

  const toggleUserDropdown = () => {
    setDropdownOpen(null);
    setShowProjectsDropdown(false);
    setShowUserDropdown(!showUserDropdown);
  }; // for dropdown to open one at a time

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

    // setTotalSoldUnitsCount(totalSoldUnits);
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

  
  
  const handleMarkUnitAvailable = async (projectId, blockId, unitId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to mark this unit as Available?"
    );
    if (isConfirmed) {
      try {
        const response = await axios.put(
          `${process.env.REACT_APP_API_URL}/markUnitAvailable/${projectId}/${blockId}/${unitId}`
        );
        const data = response.data;
        if (response.status === 200 && data.status === "ok") {
          fetchProjects(); // Update projects after successfully marking unit as available
          alert("Unit marked as available successfully");
        } else {
          console.error("Failed to mark unit as available:", data.error);
        }
      } catch (error) {
        console.error("Error marking unit as available:", error);
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
    setSelectedBlockId("null"); // Reset selected block when project is clicked
    setShowBlocks(!showBlocks); // Toggle showing blocks
    setShowUnits(true); // Reset showing units
  };

  const handleClickBlock = (blockId) => {
    setSelectedBlockId((prevId) => (prevId === blockId ? null : blockId));
  };

  const handleDeleteUnit = async (projectId, blockId, unitId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this unit?"
    );
    if (isConfirmed) {
      try {
        const response = await axios.delete(
          `${process.env.REACT_APP_API_URL}/deleteUnit/${projectId}/${blockId}/${unitId}`
        );
        const data = response.data;
        if (response.status === 200 && data.status === "ok") {
          fetchProjects();
        } else {
          console.error("Failed to delete unit:", data.error);
        }
      } catch (error) {
        console.error("Error deleting unit:", error);
      }
    }
  };

  return (
    <div className="container">
      
    </div>
  );
};

export default ProjectsUpload;

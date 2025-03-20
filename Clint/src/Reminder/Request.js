import React, { useEffect, useState } from "react";
import {
  fetchProjects,
  fetchCreateRequest,
  fetchAllUsers,
  updateRequestStatus,
} from "../services/customerService";
import axios from "axios";

const Request = () => {
  const [projects, setProjects] = useState([]);
  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const projectsData = await fetchProjects();
        setProjects(projectsData);

        const requestsData = await fetchCreateRequest();
        setRequests(requestsData.data);

        const usersData = await fetchAllUsers();
        const combinedUsers = [
          ...(usersData.data.users || []),
          ...(usersData.data.subAdmins || []),
        ];
        setUsers(combinedUsers);

        setLoading(false);
      } catch (err) {
        setError(err.message || "An error occurred");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
          fetchProjects();
          alert("Unit marked as hold successfully");
        } else {
          console.error("Failed to mark unit as hold:", data.error);
        }
      } catch (error) {
        console.error("Error marking unit as hold:", error);
      }
    }
  };

  const handleUpdateStatus = async (_id, status) => {
    try {
      await updateRequestStatus(_id, status);
      setRequests((prevRequests) => prevRequests.filter((req) => req._id !== _id));
    } catch (err) {
      setError("Failed to update request status");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const getUserById = (userId) => {
    return users.find((user) => user._id === userId) || null;
  };

  const getProjectBlockAndUnitById = (projectId, blockId, unitId) => {
    const project = projects.find((proj) => proj._id === projectId);
    if (project) {
      const block = project.blocks.find((blk) => blk._id === blockId);
      if (block) {
        const unit = block.units.find((unit) => unit._id === unitId);
        return { project, block, unit };
      }
      return { project, block: null, unit: null };
    }
    return { project: null, block: null, unit: null };
  };

  const pendingRequests = requests.filter((request) => request.status === null);
  const processedRequests = requests.filter((request) => request.status !== null);

  return (
    <div>
      {pendingRequests.length > 0 && (
        <div className="notpadd">
            {pendingRequests.map((request) => {
              const user = getUserById(request.user_id);
              const { project, block, unit } = getProjectBlockAndUnitById(
                request.project_id,
                request.block_id,
                request.unit_id
              );

              return (
                user &&
                project &&
                block &&
                unit && (
                  <div key={request._id} className="hovergray">
                    <p className="requesttext">
                      <b>{user.fname} {user.lname}</b> is asking to hold unit <b>{unit.name}</b> in
                      block <b>{block.name}</b> of project <b>{project.name}</b>.
                    </p>
                    <button
                      onClick={() => {
                        handleUpdateStatus(request._id, "Approved");
                        handleMarkUnitHold(project._id, block._id, unit._id);
                      }}
                      className="approvebutton"
                    >
                      Approve
                    </button>
                    <button onClick={() => handleUpdateStatus(request._id, "Ignored")} className="ignorebutton">
                      Ignore
                    </button>
                  </div>
                )
              );
            })}
        </div>
      )}

      {processedRequests.length > 0 && (
        <div className="notpadd">
            {processedRequests.map((request) => {
              const user = getUserById(request.user_id);
              const { project, block, unit } = getProjectBlockAndUnitById(
                request.project_id,
                request.block_id,
                request.unit_id
              );

              return (
                user &&
                project &&
                block &&
                unit && (
                  <div key={request._id} className="hovergray">
                    <p className="requesttext">
                      <b>{user.fname} {user.lname}</b> request for unit <b>{unit.name}</b> in block{" "}
                      <b>{block.name}</b> of project <b>{project.name}</b> has <b>{request.status}</b>.
                    </p>
                  </div>
                )
              );
            })}
        </div>
      )}
    </div>
  );
};

export default Request;

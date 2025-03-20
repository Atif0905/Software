import React, { useEffect, useState } from 'react';
import {
  fetchProjects,
  fetchCreateRequest,
  fetchAllUsers,
} from '../../services/customerService';
import Loader from '../../Confirmation/Loader';

const AdminHoldhistory = () => {
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
        setError(err.message || 'An error occurred');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getUserById = (userId) => {
    return users.find((user) => user._id === userId) || null;
  };
  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true, // For 12-hour clock, remove this line for 24-hour format
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
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

  if (loading) {
    return <div><Loader/></div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className='main-content'>
      <div className='formback1'>
      <h2 className='formhead'>Hold Requests</h2>
      {requests.length > 0 ? (
        <table className='unit-table'>
          <thead>
            <tr>
              <th>User Name</th>
              <th>Project Name</th>
              <th>Block Name</th>
              <th>Unit Name</th>
              <th>Status</th>
              <th>Updated Time</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => {
              const user = getUserById(request.user_id);
              const { project, block, unit } = getProjectBlockAndUnitById(
                request.project_id,
                request.block_id,
                request.unit_id
              );

              if (!user || !project || !block || !unit) {
                return (
                  <tr key={request._id}>
                    <td colSpan="4">Details not found for this request</td>
                  </tr>
                );
              }

              return (
                <tr key={request._id}>
                  <td>
                    {user.fname} {user.lname}
                  </td>
                  <td>{project.name.toUpperCase()}</td>
                  <td>{block.name}</td>
                  <td>{unit.name}</td>
                  <td>{request.status}</td>
                  <td>{formatDate(request.updated_at)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p>No requests available</p>
      )}
      </div>
    </div>
  );
};

export default AdminHoldhistory;

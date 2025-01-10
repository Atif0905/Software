import React, { useEffect, useState } from 'react';
import {
  fetchProjects,
  fetchCreateRequest,
} from '../services/customerService';
import useFetchUser from '../hooks/useFetchUser';

const UserNotification = () => {
  const [projects, setProjects] = useState([]);
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, loading: userLoading } = useFetchUser();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const projectsData = await fetchProjects();
        setProjects(projectsData);

        const requestsData = await fetchCreateRequest();
        setRequests(requestsData.data);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'An error occurred');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  if (loading || userLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const userRequests = requests
    .filter((request) => request.user_id === user._id)
    .filter((request) => {
      const updatedAt = new Date(request.updated_at);
      const now = new Date();
      const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7));
      return updatedAt >= sevenDaysAgo;
    });

  return (
    <div>
      <h2>Requests</h2>
      {userRequests.length > 0 ? (
        <ul>
          {userRequests.map((request) => {
            const { project, block, unit } = getProjectBlockAndUnitById(
              request.project_id,
              request.block_id,
              request.unit_id
            );

            return (
              <li key={request._id}>
                {project && block && unit ? (
                  <div>
                    {request.status === 'Approved' ? (
                      <p>
                        Your request for unit {unit.name} in block {block.name}{' '}
                        of project {project.name} has been approved.
                      </p>
                    ) : request.status === 'Ignored' ? (
                      <p>
                        Your request for unit {unit.name} in block {block.name}{' '}
                        of project {project.name} has been rejected.
                      </p>
                    ) : (
                      <p>
                        Your request for unit {unit.name} in block {block.name}{' '}
                        of project {project.name} is pending approval.
                      </p>
                    )}
                  </div>
                ) : (
                  <p>Details not found for this request</p>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <p>No requests available</p>
      )}
    </div>
  );
};

export default UserNotification;

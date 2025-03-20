import React, { useEffect, useState, useMemo } from 'react';
import { fetchProjects, fetchCreateRequest } from '../../services/customerService';
import useFetchUser from '../../hooks/useFetchUser';
import Loader from '../../Confirmation/Loader';

const Holdhistory = () => {
  const [projects, setProjects] = useState([]);
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, loading: userLoading } = useFetchUser();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [projectsData, requestsData] = await Promise.all([
          fetchProjects(),
          fetchCreateRequest(),
        ]);
        setProjects(projectsData);
        setRequests(requestsData.data);
      } catch (err) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getProjectBlockAndUnitById = useMemo(() => {
    const projectMap = new Map();
    projects.forEach((project) => {
      projectMap.set(project._id, {
        ...project,
        blocks: new Map(
          project.blocks.map((block) => [
            block._id,
            {
              ...block,
              units: new Map(block.units.map((unit) => [unit._id, unit])),
            },
          ])
        ),
      });
    });

    return (projectId, blockId, unitId) => {
      const project = projectMap.get(projectId);
      const block = project?.blocks.get(blockId);
      const unit = block?.units.get(unitId);
      return { project, block, unit };
    };
  }, [projects]);

  const userRequests = useMemo(
    () => requests.filter((request) => request.user_id === user?._id),
    [requests, user]
  );

  const renderStatus = (status) => {
    if (status === null) return 'Pending';
    if (status === 'ignore') return 'Rejected';
    return status;
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  if (loading || userLoading) return <Loader />;

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="main-content">
      {userRequests.length > 0 ? (
        <div className="formback1 p-2">
          <h2 className='formhead'>Hold History</h2>
          <table className='unit-table'>
            <thead>
              <tr>
                <th>Project Name</th>
                <th>Block Name</th>
                <th>Unit Name</th>
                <th>Updated Time</th>
                <th>Approval Status</th>
              </tr>
            </thead>
            <tbody>
              {userRequests.map((request) => {
                const { project, block, unit } = getProjectBlockAndUnitById(
                  request.project_id,
                  request.block_id,
                  request.unit_id
                );

                if (!project || !block || !unit) {
                  return (
                    <tr key={request._id}>
                      <td colSpan="5">Details not found for this request</td>
                    </tr>
                  );
                }

                return (
                  <tr key={request._id}>
                    <td>{project.name}</td>
                    <td>{block.name}</td>
                    <td>{unit.name}</td>
                    <td>{formatDate(request.updated_at)}</td>
                    <td>{renderStatus(request.status)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default React.memo(Holdhistory);

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
import ConfirmationModal from '../../../Confirmation/ConfirmationModal';
// import './AdditionBlock.css'; // Assuming you have a CSS file for styling

const AdditionBlock = () => {
  const [totalPlotInBlock, setTotalPlotInBlock] = useState('');
  const [plotSize, setPlotSize] = useState('');
  const [basicRateOfBlock, setBasicRateOfBlock] = useState('');
  const [idcRateOfBlock, setIdcRateOfBlock] = useState('');
  const [edcRateOfBlock, setEdcRateOfBlock] = useState('');
  const [newBlockName, setNewBlockName] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [projects, setProjects] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [csvData, setCsvData] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/getAllProjects`);
      const data = response.data;
      if (response.status === 200 && data.status === 'ok') {
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
        console.error('Failed to fetch projects:', data.error);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const getUnitCount = async (projectId, blockId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/getUnitCount/${projectId}/${blockId}`);
      const data = response.data;
      if (response.status === 200 && data.status === 'ok') {
        return data.unitCount;
      } else {
        console.error('Failed to get unit count:', data.error);
        return 0;
      }
    } catch (error) {
      console.error('Error getting unit count:', error);
      return 0;
    }
  };

  const handleAddBlock = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/addBlock/${selectedProjectId}`,
        {
          name: newBlockName,
          totalPlotInBlock,
          plotSize,
          basicRateOfBlock,
          idcRateOfBlock,
          edcRateOfBlock,
        }
      );
      const data = response.data;
      if (response.status === 201 && data.status === 'ok') {
        fetchProjects();
        setNewBlockName('');
        setTotalPlotInBlock('');
        setPlotSize('');
        setBasicRateOfBlock('');
        setIdcRateOfBlock('');
        setEdcRateOfBlock('');
      }
    } catch (error) {
      console.error('Error adding block:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const numberInputOnWheelPreventChange = (e) => {
    e.target.blur();
    e.stopPropagation();
    setTimeout(() => {
      e.target.focus();
    }, 0);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        complete: (results) => {
          // Log the results to inspect the data
          console.log('CSV Results:', results);

          const { data, meta } = results;
          if (meta.fields) {
            const parsedData = data.map(row => ({
              name: row['Block Name'],
              totalPlotInBlock: row['Total Plot'],
              plotSize: row['Plot Size'],
              basicRateOfBlock: row['Basic Rate'],
              idcRateOfBlock: row['IDC Rate'],
              edcRateOfBlock: row['EDC Rate'],
            }));
            setCsvData(parsedData);
          } else {
            console.error('CSV parsing error: Header is missing or in unexpected format');
          }
        },
        header: true,
        skipEmptyLines: true,
        error: (error) => {
          console.error('Error parsing CSV:', error);
        }
      });
    }
  };

  const handleBulkUpload = async () => {
    try {
      if (!selectedProjectId) {
        console.error('No project selected.');
        return;
      }
      for (const block of csvData) {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/addBlock/${selectedProjectId}`,
          block
        );
      }
      fetchProjects();
      setCsvData([]);
    } catch (error) {
      console.error('Error bulk uploading blocks:', error);
    }
  };

  return (
    <div className="main-content back">
      <h4 className="Headtext">Add Block</h4>
      <div className="col-6 whiteback">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select Project</label>
            <select
              className="form-input-field select-buttons"
              onChange={(e) => setSelectedProjectId(e.target.value)}
              required
            >
              <option value="">Select Project</option>
              {projects.map((project, index) => (
                <option key={index} value={project._id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Block Name</label>
            <input
              type="text"
              className="form-input-field"
              placeholder="Block Name"
              value={newBlockName}
              onChange={(e) => setNewBlockName(e.target.value.toUpperCase())}
              required
            />
          </div>

          <div className="form-group">
            <label>Total Plot</label>
            <input
              type="number"
              onWheel={numberInputOnWheelPreventChange}
              className="form-input-field"
              placeholder="Total Plot in Block"
              value={totalPlotInBlock}
              onChange={(e) => setTotalPlotInBlock(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Plot Size</label>
            <input
              type="number"
              onWheel={numberInputOnWheelPreventChange}
              className="form-input-field"
              placeholder="Plot Size (sqyd)"
              value={plotSize}
              onChange={(e) => setPlotSize(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Basic Rate</label>
            <input
              type="number"
              onWheel={numberInputOnWheelPreventChange}
              className="form-input-field"
              placeholder="Basic Rate of Block"
              value={basicRateOfBlock}
              onChange={(e) => setBasicRateOfBlock(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>IDC Rate</label>
            <input
              type="number"
              onWheel={numberInputOnWheelPreventChange}
              className="form-input-field"
              placeholder="IDC Rate of Block"
              value={idcRateOfBlock}
              onChange={(e) => setIdcRateOfBlock(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>EDC Rate</label>
            <input
              type="number"
              onWheel={numberInputOnWheelPreventChange}
              className="form-input-field"
              placeholder="EDC Rate of Block"
              value={edcRateOfBlock}
              onChange={(e) => setEdcRateOfBlock(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="add-buttons mt-3">
            Add Block
          </button>

          <div className="form-group mt-4">
            <label>Upload CSV</label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="form-input-field"
            />
            <button
              type="button"
              className="add-buttons mt-2"
              onClick={handleBulkUpload}
              disabled={csvData.length === 0}
            >
              Upload CSV
            </button>
          </div>

          <ConfirmationModal
            show={showConfirm}
            onClose={() => setShowConfirm(false)}
            onConfirm={() => {
              setShowConfirm(false);
              handleAddBlock();
            }}
            message="Are you sure you want to add this block?"
          />
        </form>
      </div>
    </div>
  );
};

export default AdditionBlock

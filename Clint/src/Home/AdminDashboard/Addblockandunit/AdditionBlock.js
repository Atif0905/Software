import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
import ConfirmationModal from '../../../Confirmation/ConfirmationModal';

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
  const [fileName, setFileName] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
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
        setShowModal(true);
      }
    } catch (error) {
      console.error('Error adding block:', error);
      setErrorMessage(error.text || "An unexpected error occurred.");
      setErrorModal(true);
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
      setFileName(file.name); // Set the file name when a file is selected

      Papa.parse(file, {
        complete: (results) => {
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
    } else {
      setFileName(null); // Reset file name if no file is selected
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
  const closeModal = () => {
    setShowModal(false);
  };

  const closeErrorModal = () => {
    setErrorModal(false);
  };
  return (
    <div className="main-content">
      <div className='formback'>
        <h4 className="formhead">Add Block</h4>
        <div className="p-3">
          <form onSubmit={handleSubmit}>
            <div className='row'>
              <div className="form-group col-6">
                <label>Select Project</label>
                <select className="form-input-field select-buttons" onChange={(e) => setSelectedProjectId(e.target.value)} required>
                  <option value="">Select Project</option>
                  {projects.map((project, index) => (
                    <option key={index} value={project._id}>
                      {project.name.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group col-6">
                <label>Block Name</label>
                <input type="text" className="form-input-field" placeholder="Block Name" value={newBlockName} onChange={(e) => setNewBlockName(e.target.value.toUpperCase())} required />
              </div>
              <div className="form-group col-6">
                <label>Total Plot</label>
                <input type="number" onWheel={numberInputOnWheelPreventChange} className="form-input-field" placeholder="Total Plot in Block" value={totalPlotInBlock} onChange={(e) => setTotalPlotInBlock(e.target.value)} required />
              </div>
              <div className="form-group col-6">
                <label>Plot Size</label>
                <input type="number" onWheel={numberInputOnWheelPreventChange} className="form-input-field" placeholder="Plot Size (sqyd)" value={plotSize} onChange={(e) => setPlotSize(e.target.value)} required />
              </div>
              <div className="form-group col-6">
                <label>Basic Rate</label>
                <input type="number" onWheel={numberInputOnWheelPreventChange} className="form-input-field" placeholder="Basic Rate of Block" value={basicRateOfBlock} onChange={(e) => setBasicRateOfBlock(e.target.value)} required />
              </div>
              <div className="form-group col-6">
                <label>IDC Rate</label>
                <input type="number" onWheel={numberInputOnWheelPreventChange} className="form-input-field" placeholder="IDC Rate of Block" value={idcRateOfBlock} onChange={(e) => setIdcRateOfBlock(e.target.value)} required />
              </div>
              <div className="form-group col-6">
                <label>EDC Rate</label>
                <input type="number" onWheel={numberInputOnWheelPreventChange} className="form-input-field" placeholder="EDC Rate of Block" value={edcRateOfBlock} onChange={(e) => setEdcRateOfBlock(e.target.value)} required />
              </div>
              <div className="form-group col-6">
                <div>
                  <div><label>Upload By CSV</label></div>
                  <div className="file-upload-wrapper d-flex">
                    <label htmlFor="csvUpload" className="custom-file-upload">
                      Choose File
                    </label>
                    <input type="file" className="" id="csvUpload" accept=".csv" onChange={handleFileUpload} style={{ display: 'none' }}
                    />
                    <div>
                      {fileName ? (
                        <p>{fileName}</p>
                      ) : (
                        <p className='mt-2  '>
                          <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="35" height="35" fill="none" viewBox="0 0 35 35">
                            <g filter="url(#filter0_d_1556_758)">
                              <path fill="url(#pattern0_1556_758)" d="M4 0H31V27H4z" shapeRendering="crispEdges" ></path>
                            </g>
                            <defs>
                              <filter id="filter0_d_1556_758" width="35" height="35" x="0" y="0" colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse"
                              >
                                <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
                                <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" ></feColorMatrix>
                                <feOffset dy="4"></feOffset>
                                <feGaussianBlur stdDeviation="2"></feGaussianBlur>
                                <feComposite in2="hardAlpha" operator="out"></feComposite>
                                <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"></feColorMatrix>
                                <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_1556_758"></feBlend>
                                <feBlend in="SourceGraphic" in2="effect1_dropShadow_1556_758" result="shape" ></feBlend>
                              </filter>
                              <pattern id="pattern0_1556_758" width="1" height="1" patternContentUnits="objectBoundingBox" >
                                <use transform="scale(.01111)" xlinkHref="#image0_1556_758"></use>
                              </pattern>
                              <image id="image0_1556_758" width="90" height="90" xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFQklEQVR4nO2dW2gkRRRAS0HX549fPlBc9Ud8g6g/PhD1R/0SQUUiiG+J62Iy906iRsUn6kfcDwV1BRUfu6A/LqggrBBXXaMkGNL3dlxcg6uiroqbpKs6SsudSQQDNepuPXomdaAgzEym7j1T01XdVdWjVCKRSCQSiUQikUgk/kk1fssBBQ2vLfPmhYahTxPeZwhGNeMrhmCLJvzYMJIh3KEZf1kqc4axkiJ/Lz8ur5HXaoJtrf9tv8do6z0Z+qQOqUvqVL1INbX+iJKb55fcuNUwPKEJX9cMY4bgW03w57K0UKVVp9TNMKYJXpOYJDaJUWJVdaeaXX9wmTfOKzO8zRBsMIwfGIIfQos0+1raMUvsGySXkvFcyS2u3K9HDioY+jXhp5phMbok9vQtYFjUDNt1Busk56CS53noGM0wGVuCCS99UnIPIrnK+9dowonYSZtYsgknxIF30fIVip2siS2b8S7/ohm2x07UxBZN8Il/0QTzsRM1sUUzznkXHTtJU5OSRHMSXcVuhalF879JgL4Oh7IbkmhXrYjgJrvo5s1JtCPRJeEdNtEFwZ1JtCPROoN1NtGa8O4k2pVohkG76GYjiXYmGoetohnuTaKdDanggQ6jjgeTaHejjkc7iH4siXYn+kmraMKnkmh3okc7iH4miXbVGRI8ax914HNJtLtRx4t20bAxiXYmGl62ipY1HM5GN/+9KN/ESEozvNFB9JtJtLPOEN+yf/Dwdk+K1oR/BE+M8B2raIItEb5hi705Z0jwnl00vh9eNP7uXzTj7uCJEWy1xkOwNYLon7yLNgQzERL7qIPobaHjkZWr3kW3VoOGF/2ZPR4cDx4P4YfeRRuGzeFFw6RddPg1gDKkDCAaHw+dmCGctscDWYR4HvEvOoMbIyT2lTWe9mr/2szKO6PkxjnhRcOsXTTMho6nzAbPDrVsVwdO7vsOooPuLNAERTU1cqAKgaymDJoc4+66jOtlOKlCYRgeCisa9nQQ/fdOrZ7pCJeRY1TQ5Lg+pWS4IJjoqlL7yTay2EmbwEUOU8H3Ksr00ioU/bwKTZHjZbETN4FLwXhJcNGtw4dsIa6BABOm5FU1sr+KgexOqoGAKvaKVu9U2eDhmvC32BKM56IJfq2mRg5TMTEMT8cWYSKulAq8Xdn/SYNuT6FtWlrUKGVTiGk1OVmazwaPVnVAE9zvN2HYWTCesLLeIh840fdFJVkWrOpCtWvkEM8JX2ur2+Rwnbd6Cb+JfhuJlRiC630lXNDwWlu9c9NDR8X4gKPRPi33M/VfZHC8rd65qYEjPUl+V3JSdWTpPh4/u0+6cY2tTml1ruuTHGrTAdowhFe7Fw07peNbWVcxgyf56Bt0DlepbkATvuQ8ecKF9gy8XAtvlc3tx1zXAxtVtyD3Hlq6nVrVTUUzjssISnUTrU4qwsSp2fuyK9j9klxjcjgr+FQT701Lhj2G4QzVzcg1XO3hWOpMMuFCQXCx6gWKvHGpTNPXsCUbzXC56iV0jldEWA/SqSVriUn1IkUGF9Xh+rUsJJepONXLmJnGKXFHI/Cd4aEz1WpgYQccpwk+j9CSxxdmho9Vq4lKTmoYXggnGV7tupMRl5QEt/sc/sl7yy2KY+dZCzQ3TtaEX3hoxV8aap4eO79aUeX9awzBw5qxdCDYyIWnYMtruxGTwWn7stNKdnCZ6eapsfPoGnQOV/6vbROtISP01XZWpM5UsruAYVA2UNo7O/hRMw4EuXl2r1NN3HNoe3QC22TVUPtnQWBMfnFCnosdXyKRSCQSiUQikUiobuYvPTRszflZatYAAAAASUVORK5CYII=" ></image>
                            </defs>
                          </svg>
                          No file selected
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className='col-6 pright'>
                <button type="submit" className="addbutton">
                  Add Block
                </button></div>
              <div className='col-6'>
                <button type="button" className="addbutton " onClick={handleBulkUpload} disabled={csvData.length === 0} >Upload CSV</button></div>
              <ConfirmationModal
                show={showConfirm}
                onClose={() => setShowConfirm(false)}
                onConfirm={() => {
                  setShowConfirm(false);
                  handleAddBlock();
                }}
                message="Are you sure you want to add this block?"
              />
            </div>
          </form>
        </div>
      </div>
      {showModal && (
        <div className="homemodal">
          <div className="homemodal-content">
            <p>Block Uploaded Successfully</p>
            <button onClick={closeModal}>Ok</button>
          </div>
        </div>
      )}
      {errorModal && (
        <div className="homemodal">
          <div className="homemodal-content">
            <p>{errorMessage}</p>
            <button onClick={closeErrorModal}>Ok</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdditionBlock

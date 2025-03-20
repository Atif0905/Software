import React, { useState } from 'react';
import axios from 'axios';
import Papa from 'papaparse'; 
import './Projects.css';
import ConfirmationModal from '../Confirmation/ConfirmationModal';
const Projects = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [blocks, setBlocks] = useState([{ name: '', units: [{ name: '' }] }]);
  const [totalLand, setTotalLand] = useState('');
  const [GST, setGST] = useState('');
  const [AccountNo, setAccountNo] = useState('');
  const [Bank, setBank] = useState('');
  const [IFSC, setIFSC] = useState('');
  const [Payable, setPayable] = useState('');
  const [Bsprate, setBsprate] = useState('');
  const [Posessionfinaldate, setPosessionfinaldate] = useState('');
  const [CompanyName, setCompanyName] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [fileName, setFileName] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false); 
  const handleCSVUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
          if (results.data && results.data.length > 0) {
            const projectData = results.data[0];
            setName(projectData.name || '');
            setDescription(projectData.description || '');
            setTotalLand(projectData.totalLand || '');
            setGST(projectData.GST || '');
            setAccountNo(projectData.AccountNo || '');
            setBank(projectData.Bank || '');
            setIFSC(projectData.IFSC || '');
            setPayable(projectData.Payable || '');
            setBsprate(projectData.Bsprate || '');
            setPosessionfinaldate(projectData.Posessionfinaldate || '');
            setCompanyName(projectData.CompanyName || '');
            setBlocks([{ name: projectData.blockName || '', units: [{ name: projectData.unitName || '' }] }]);
          }
        }
      });
    } else {
      setFileName(null);
    }
  };
  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/uploadProject`, { name, description, totalLand, GST, AccountNo, Bank, IFSC, Payable, blocks, Bsprate, CompanyName, Posessionfinaldate
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      const data = response.data;
      if (response.status === 201 && data.status === 'ok') {
        setName('');
        setDescription('');
        setTotalLand('');
        setGST('');
        setAccountNo('');
        setBsprate('');
        setBank('');
        setIFSC('');
        setPayable('');
        setCompanyName('');
        setPosessionfinaldate('');
        setShowModal(true);
        setBlocks([{ name: '', units: [{ name: '' }] }]);
      } else {
        alert(data.error || 'Failed to upload project');
      }
    } catch (error) {
      console.error('Error uploading project:', error);
      setErrorMessage(error.text || "An unexpected error occurred.");
      setErrorModal(true);
    }
  };
  const handleSubmit1 = (e) => {
    e.preventDefault();
    setShowConfirm(true);
  };
  const closeModal = () => {
    setShowModal(false);
  };

  const closeErrorModal = () => {
    setErrorModal(false);
  };

  return (
    <div className="main-content back">
      <div className='formback'>
        <h3 className='formhead'>Add a New Project</h3>
        <div className='p-3'>
          <form onSubmit={handleSubmit1}>
            <div className='row'>
            <div className="form-group col-6">
              <label htmlFor="name" className="ml">Project Name</label>
              <input type="text" className='form-input-field' id="Project name" value={name.toUpperCase()} placeholder="Enter Project Name" onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="form-group col-6">
              <label htmlFor="description" className='ml'>Location</label>
              <input type='text' className='form-input-field' id="description" placeholder='Location' value={description} onChange={(e) => setDescription(e.target.value)} rows="5" required />
            </div>
            <div className="form-group col-6">
              <label htmlFor="totalLand" className="ml">Basic Rate</label>
              <input type="number" className='form-input-field' id="Bsprate" value={Bsprate} placeholder="Basic Rate" onChange={(e) => setBsprate(e.target.value)} required />
            </div>
            <div className="form-group col-6">
              <label htmlFor="totalLand" className="ml">Total Land</label>
              <input type="text" className='form-input-field' id="totalLand" value={totalLand} placeholder="Total Land" onChange={(e) => setTotalLand(e.target.value)} required />
            </div>
            <div className="form-group col-6">
              <label htmlFor="GST" className="ml">Company Name</label>
              <select type="text" className='form-input-field' id="CompanyName" value={CompanyName} onChange={(e) => setCompanyName(e.target.value)} required >
                <option>Select Company</option>
                <option>Test 1</option>
                <option>Test 2  </option>
              </select>
            </div>
            <div className="form-group col-6">
              <label htmlFor="GST" className="ml">GST Number</label>
              <input type="text" className='form-input-field' id="GST" value={GST.toUpperCase()} placeholder="Enter GST Number" onChange={(e) => setGST(e.target.value)} required />
            </div>
            <div className="form-group col-6">
              <label htmlFor="AccountNo" className="ml">Account No</label>
              <input type="text" className='form-input-field' id="AccountNo" value={AccountNo.toUpperCase()} placeholder="Enter Account No" onChange={(e) => setAccountNo(e.target.value)} required />
            </div>
            <div className="form-group col-6">
              <label htmlFor="Bank" className="ml">Bank Name</label>
              <input type="text" className='form-input-field' id="Bank" value={Bank.toUpperCase()} placeholder="Enter Bank Name" onChange={(e) => setBank(e.target.value)} required />
            </div>
            <div className="form-group col-6">
              <label htmlFor="IFSC" className="ml">IFSC</label>
              <input type="text" className='form-input-field' id="IFSC" value={IFSC.toUpperCase()} placeholder="Enter IFSC Code" onChange={(e) => setIFSC(e.target.value)} required />
            </div>
            <div className="form-group col-6">
              <label htmlFor="Payable" className="ml">Payable At</label>
              <input type="text" className='form-input-field' id="Payable" value={Payable.toUpperCase()} placeholder="Payable At" onChange={(e) => setPayable(e.target.value)} required />
            </div>
            <div className="form-group col-6">
              <label htmlFor="Posessionfinaldate" className="ml">Posession Final Date</label>
              <input type="date" className='form-input-field' id="Posessionfinaldate" value={Posessionfinaldate.toUpperCase()} placeholder="Posession final date" onChange={(e) => setPosessionfinaldate(e.target.value)} required />
            </div>
            <div className="form-group col-6">
      <div>
        <div><label>Upload By CSV</label></div>
        <div className="file-upload-wrapper d-flex">
          <label htmlFor="csvUpload" className="custom-file-upload">
            Choose File
          </label>
          <input type="file" className="filebutton" id="csvUpload" accept=".csv" onChange={handleCSVUpload} style={{ display: 'none' }} />
          <div className="file-info">
            {fileName ? (
              <span>{fileName}</span>
            ) : (
              <div className='mt-2'>
            <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="35" height="35" fill="none" viewBox="0 0 35 35">
      <g filter="url(#filter0_d_1556_758)">
        <path
          fill="url(#pattern0_1556_758)"
          d="M4 0H31V27H4z"
          shapeRendering="crispEdges"
        ></path>
      </g>
      <defs>
        <filter id="filter0_d_1556_758" width="35" height="35" x="0" y="0" colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" >
          <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
          <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          ></feColorMatrix>
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
    </svg> No file choosen</div>
            )}
            </div>
            </div>
            </div>
            </div>
            <div className="form-group  center">
              <button type="submit" className='addbutton'>Upload Project</button>
            </div>
            </div>
          </form>
          <ConfirmationModal show={showConfirm} onClose={() => setShowConfirm(false)} onConfirm={() => {   setShowConfirm(false);   handleSubmit();}}message="Are you sure you want to add this Project?"/>
        </div>
      </div>
      {showModal && (
        <div className="homemodal">
          <div className="homemodal-content">
            <p>Project Uploaded Successfully</p>
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
export default Projects;
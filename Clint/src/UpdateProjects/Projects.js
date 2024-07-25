import React, { useState } from 'react';
import axios from 'axios';
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
  const [CompanyName, setCompanyName] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/uploadProject`, {
        name,
        description,
        totalLand,
        GST,
        AccountNo,
        Bank,
        IFSC,
        Payable,
        blocks,
        CompanyName
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      const data = response.data;
      if (response.status === 201 && data.status === 'ok') {
        alert('Project uploaded successfully!');
        setName('');
        setDescription('');
        setTotalLand('');
        setGST('');
        setAccountNo('');
        setBank('');
        setIFSC('');
        setPayable('');
        setCompanyName('');
        setBlocks([{ name: '', units: [{ name: '' }] }]);
      } else {
        alert(data.error || 'Failed to upload project');
      }
    } catch (error) {
      console.error('Error uploading project:', error);
      alert('An error occurred while uploading project');
    }
  };

  const handleSubmit1 = (e) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  return (
    <div className="main-content back">
      <div className=''>
        <h3 className='Headtext'>Add a New Project</h3>
        <div className='col-6 whiteback'>
          <form onSubmit={handleSubmit1}>
            <div className="form-group mt-3">
              <label htmlFor="name" className="ml">Project Name</label>
              <input type="text" className='form-input-field' id="Project name" value={name} placeholder="Enter Project Name" onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="form-group mt-3">
              <label htmlFor="description" className='ml'>Location</label>
              <input type='text' className='form-input-field' id="description" placeholder='Location' value={description} onChange={(e) => setDescription(e.target.value)} rows="5" required />
            </div>
            <div className="form-group mt-3">
              <label htmlFor="totalLand" className="ml">Total Land</label>
              <input type="text" className='form-input-field' id="totalLand" value={totalLand} placeholder="Total Land" onChange={(e) => setTotalLand(e.target.value)} required />
            </div>
            <div className="form-group mt-3">
              <label htmlFor="GST" className="ml">Company Name</label>
              <select type="text" className='form-input-field' id="CompanyName" value={CompanyName} onChange={(e) => setCompanyName(e.target.value)} required >
                <option>Select Company</option>
                <option>WOMEKI INVESTORS CLUB Pvt Ltd</option>
                <option>WOMEKI INFRA  </option>
              </select>
            </div>
            <div className="form-group mt-3">
              <label htmlFor="GST" className="ml">GST Number</label>
              <input type="text" className='form-input-field' id="GST" value={GST} placeholder="Enter GST Number" onChange={(e) => setGST(e.target.value)} required />
            </div>
            <div className="form-group mt-3">
              <label htmlFor="AccountNo" className="ml">Account No</label>
              <input type="text" className='form-input-field' id="AccountNo" value={AccountNo} placeholder="Enter Account No" onChange={(e) => setAccountNo(e.target.value)} required />
            </div>
            <div className="form-group mt-3">
              <label htmlFor="Bank" className="ml">Bank Name</label>
              <input type="text" className='form-input-field' id="Bank" value={Bank} placeholder="Enter Bank Name" onChange={(e) => setBank(e.target.value)} required />
            </div>
            <div className="form-group mt-3">
              <label htmlFor="IFSC" className="ml">IFSC</label>
              <input type="text" className='form-input-field' id="IFSC" value={IFSC} placeholder="Enter IFSC Code" onChange={(e) => setIFSC(e.target.value)} required />
            </div>
            <div className="form-group mt-3">
              <label htmlFor="Payable" className="ml">Payable At</label>
              <input type="text" className='form-input-field' id="Payable" value={Payable} placeholder="Payable At" onChange={(e) => setPayable(e.target.value)} required />
            </div>
            <div className="form-group mt-3 mb-3">
              <button type="submit" className='uploadbutt'>Upload Project</button>
            </div>
          </form>
          <ConfirmationModal
            show={showConfirm}
            onClose={() => setShowConfirm(false)}
            onConfirm={() => {
              setShowConfirm(false);
              handleSubmit();
            }}
            message="Are you sure you want to add this Project?"
          />
        </div>
      </div>
    </div>
  );
};

export default Projects;

import React, { useState } from 'react';
import axios from 'axios';
import './Projects.css'
const Projects = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [blocks, setBlocks] = useState([{ name: '', units: [{ name: '' }] }]);
  const [totalLand, settotalLand] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/uploadProject`, {
        name,
        description,
        totalLand,
        blocks 
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
        settotalLand('');
        setBlocks([{ name: '', units: [{ name: '' }] }]);
      } else {
        alert(data.error || 'Failed to upload project');
      }
    } catch (error) {
      console.error('Error uploading project:', error);
      alert('An error occurred while uploading project');
    }
  };
  return (
    <div className="main-content back ">
      <div className=''>
        <h3 className='Headtext' >Add a New Project</h3>
        <div className='col-6 whiteback '>
          <form onSubmit={handleSubmit}>
            <div className="form-group mt-3">
              <label htmlFor="name" className="ml">Project Name</label>
              <input type="text" className='form-input-field' id="name" value={name} placeholder="Enter Project Name" onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="form-group mt-3">
              <label htmlFor="description" className='ml'>Location</label>
              <input type='text' className='form-input-field' id="description" placeholder='Location' value={description} onChange={(e) => setDescription(e.target.value)} rows="5" required ></input>
            </div>
            <div className="form-group mt-3">
              <label htmlFor="name" className="ml">Total land</label>
              <input type="text" className='form-input-field' id="name" value={totalLand} placeholder="Total Land" onChange={(e) => settotalLand(e.target.value)} required />
            </div>
            <div className="form-group mt-3 mb-3">
              <button type="submit" className='uploadbutt'>Upload Project</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Projects;
import React, { useState } from 'react';
import axios from 'axios';
import './Projects.css'
const Projects = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [blocks, setBlocks] = useState([{ name: '', units: [{ name: '' }] }]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/uploadProject`, {
        name,
        description,
        blocks // Pass blocks data to the backend
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
        setBlocks([{ name: '', units: [{ name: '' }] }]);
      } else {
        alert(data.error || 'Failed to upload project');
      }
    } catch (error) {
      console.error('Error uploading project:', error);
      alert('An error occurred while uploading project');
    }
  };

  const handleBlockChange = (index, e) => {
    const { name, value } = e.target;
    const updatedBlocks = [...blocks];
    updatedBlocks[index][name] = value;
    setBlocks(updatedBlocks);
  };

  const handleUnitChange = (blockIndex, unitIndex, e) => {
    const { name, value } = e.target;
    const updatedBlocks = [...blocks];
    updatedBlocks[blockIndex].units[unitIndex][name] = value;
    setBlocks(updatedBlocks);
  };

  const addBlock = () => {
    setBlocks([...blocks, { name: '', units: [{ name: '' }] }]);
  };

  const addUnit = (blockIndex) => {
    const updatedBlocks = [...blocks];
    updatedBlocks[blockIndex].units.push({ name: '' });
    setBlocks(updatedBlocks);
  };

  return (
    <div className="  container">
   <div className='row'>
    <div className='col-12'>
      <form onSubmit={handleSubmit}>
        <div className="form-group mt-4">
        <label htmlFor="name" className=""></label>
          <input type="text" className='form-input-field' id="name" value={name} placeholder="Enter Project Name" onChange={(e) => setName(e.target.value)}  required />
        </div>
        <div className="form-group mt-3">
          <label htmlFor="description" className=''></label>
          <textarea className='form-msg-field' id="description" placeholder='Description' value={description} onChange={(e) => setDescription(e.target.value)} rows="5" required ></textarea>
        </div>
        {blocks.map((block, blockIndex) => (
          <div key={blockIndex}>
            <div className="form-group mt-2">
              <label htmlFor={`blockName${blockIndex}`} className=''></label>
              <input type="text" className='form-input-field' id={`blockName${blockIndex}`} name="name" placeholder='Block Name' value={block.name} onChange={(e) => handleBlockChange(blockIndex, e)} required />
            </div>
            {block.units.map((unit, unitIndex) => (
              <div key={unitIndex}>
                <div className="form-group mt-3">
                  <label htmlFor={`unitName${blockIndex}_${unitIndex}`} className=''></label>
                  <input
                    type="text" className='form-input-field' id={`unitName${blockIndex}_${unitIndex}`} name="name" placeholder='Unit Name' value={unit.name} onChange={(e) => handleUnitChange(blockIndex, unitIndex, e)} required />
                </div>
              </div>
            ))}
           
            <button className='add-buttons mt-3' type="button" onClick={() => addUnit(blockIndex)}>Add Unit</button>
          </div>
        ))}
        <button className='add-buttons mt-3' type="button" onClick={addBlock}>Add Block</button>
     
        <div className="form-group mt-3">
          <button type="submit" className='uploadbutt'>Upload Project</button>
        </div>
      </form>
      </div>
      </div>
      </div>
  );
};

export default Projects;
import React, { useState } from 'react';
import axios from 'axios';

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
    <div className=" main-content container">
      <h2 className='mainhead'>Upload Project</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name" className='mainhead'>Project Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description" className='mainhead'>Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            required
          ></textarea>
        </div>
        {blocks.map((block, blockIndex) => (
          <div key={blockIndex}>
            <div className="form-group">
              <label htmlFor={`blockName${blockIndex}`} className='mainhead'>Block Name:</label>
              <input
                type="text"
                id={`blockName${blockIndex}`}
                name="name"
                value={block.name}
                onChange={(e) => handleBlockChange(blockIndex, e)}
                required
              />
            </div>
            {block.units.map((unit, unitIndex) => (
              <div key={unitIndex}>
                <div className="form-group">
                  <label htmlFor={`unitName${blockIndex}_${unitIndex}`} className='mainhead'>Unit Name:</label>
                  <input
                    type="text"
                    id={`unitName${blockIndex}_${unitIndex}`}
                    name="name"
                    value={unit.name}
                    onChange={(e) => handleUnitChange(blockIndex, unitIndex, e)}
                    required
                  />
                </div>
              </div>
            ))}
            <button type="button" onClick={() => addUnit(blockIndex)}>Add Unit</button>
          </div>
        ))}
        <button type="button" onClick={addBlock}>Add Block</button>
        <div className="form-group">
          <button type="submit">Upload Project</button>
        </div>
      </form>
    </div>
  );
};

export default Projects;
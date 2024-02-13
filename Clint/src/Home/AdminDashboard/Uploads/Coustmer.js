// AddCustomerForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddCustomerForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    fatherOrHusbandName: '',
    address: '',
    email: '',
    phone: '',
    aadharNumber: '',
    panNumber: '',
    income: '',
    photo: '',
    propertyType: '',
    project: '',
    block: '',
    plotUnit: '',
    discount: ''
  });

  const [propertyTypes, setPropertyTypes] = useState([]);
  const [projects, setProjects] = useState([]);
  const [blocks, setBlocks] = useState([]);

  useEffect(() => {
    fetchPropertyTypes();
    fetchProjects();
  }, []);

  const fetchPropertyTypes = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/propertyTypes`);
      setPropertyTypes(response.data);
    } catch (error) {
      console.error('Error fetching property types:', error);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/projects`);
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleProjectChange = async (projectId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/projects/${projectId}/blocks`);
      setBlocks(response.data);
    } catch (error) {
      console.error('Error fetching blocks:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value.toUpperCase() // Convert value to uppercase
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/uploadCustomer`, formData);
      console.log(response.data);
      // Reset form fields
      setFormData({
        name: '',
        fatherOrHusbandName: '',
        address: '',
        email: '',
        phone: '',
        aadharNumber: '',
        panNumber: '',
        income: '',
        photo: '',
        propertyType: '',
        project: '',
        block: '',
        plotUnit: '',
        discount: ''
      });
    } catch (err) {
      console.error(err.response.data);
    }
  };

  return (
    <div className='main-content'>
      <h2>Add Customer</h2>
      <form onSubmit={handleSubmit}>
        <div><input type="text" className="form-input-field mt-4" placeholder="Name" name="name" value={formData.name} onChange={handleChange} required /></div>
        <div><input type="text" className="form-input-field mt-4" placeholder="Father/Husband Name" name="fatherOrHusbandName" value={formData.fatherOrHusbandName} onChange={handleChange} required /></div>
        <div><input type="text" className="form-input-field mt-4" placeholder="Address" name="address" value={formData.address} onChange={handleChange} required /></div>
        <div><input type="email" className="form-input-field mt-4" placeholder="Email" name="email" value={formData.email} onChange={handleChange} required /></div>
        <div><input type="text" className="form-input-field mt-4" placeholder="Phone" name="phone" value={formData.phone} onChange={handleChange} required /></div>
        <div><input type="number" className="form-input-field mt-4" placeholder="Aadhar Number" name="aadharNumber" value={formData.aadharNumber} onChange={handleChange} required /></div>
        <div><input type="number" className="form-input-field mt-4" placeholder="PAN Number" name="panNumber" value={formData.panNumber} onChange={handleChange} required /></div>
        <div><input type="number" className="form-input-field mt-4" placeholder="Income" name="income" value={formData.income} onChange={handleChange} required /></div>
        {/* <div><input type="text" className="form-input-field mt-4" placeholder="Photo URL" name="photo" value={formData.photo} onChange={handleChange} required /></div> */}
        <div>
        <select name="propertyType" className="select-buttons mt-3 ps-1" value={formData.propertyType} onChange={handleChange}>
          <option value="">Select Property Type</option>
          {propertyTypes.map(propertyType => (
            <option key={propertyType._id} value={propertyType._id}>{propertyType.name}</option>
          ))}
        </select>
        </div>
        <div><select name="project" className="select-buttons mt-3 ps-1" value={formData.project} onChange={e => {handleChange(e); handleProjectChange(e.target.value)}}>
          <option value="">Select Project</option>
          {projects.map(project => (
            <option key={project._id} value={project._id}>{project.name}</option>
          ))}
        </select>
        </div>
        <div><select name="block" className="select-buttons mt-3 ps-1" value={formData.block} onChange={handleChange}>
          <option value="">Select Block</option>
          {blocks.map(block => (
            <option key={block._id} value={block._id}>{block.name}</option>
          ))}
        </select>
        </div>
        <div><input type="text" className="form-input-field mt-4" placeholder="Plot/Unit" name="plotUnit" value={formData.plotUnit} onChange={handleChange} required /></div>
        <div><input type="number" className="form-input-field mt-4" placeholder="Discount (%)" name="discount" value={formData.discount} onChange={handleChange} required /></div>
        
        <button type="submit" className="add-buttons mt-3">Add Customer</button>
      </form>
    </div>
  );
};

export default AddCustomerForm;

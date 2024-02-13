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

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
    <div>
      <h2>Add Customer</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Name" name="name" value={formData.name} onChange={handleChange} />
        <input type="text" placeholder="Father/Husband Name" name="fatherOrHusbandName" value={formData.fatherOrHusbandName} onChange={handleChange} />
        <input type="text" placeholder="Address" name="address" value={formData.address} onChange={handleChange} />
        <input type="email" placeholder="Email" name="email" value={formData.email} onChange={handleChange} />
        <input type="text" placeholder="Phone" name="phone" value={formData.phone} onChange={handleChange} />
        <input type="text" placeholder="Aadhar Number" name="aadharNumber" value={formData.aadharNumber} onChange={handleChange} />
        <input type="text" placeholder="PAN Number" name="panNumber" value={formData.panNumber} onChange={handleChange} />
        <input type="number" placeholder="Income" name="income" value={formData.income} onChange={handleChange} />
        <input type="text" placeholder="Photo URL" name="photo" value={formData.photo} onChange={handleChange} />
        
        <select name="propertyType" value={formData.propertyType} onChange={handleChange}>
          <option value="">Select Property Type</option>
          {propertyTypes.map(propertyType => (
            <option key={propertyType._id} value={propertyType._id}>{propertyType.name}</option>
          ))}
        </select>

        <select name="project" value={formData.project} onChange={e => {handleChange(e); handleProjectChange(e.target.value)}}>
          <option value="">Select Project</option>
          {projects.map(project => (
            <option key={project._id} value={project._id}>{project.name}</option>
          ))}
        </select>

        <select name="block" value={formData.block} onChange={handleChange}>
          <option value="">Select Block</option>
          {blocks.map(block => (
            <option key={block._id} value={block._id}>{block.name}</option>
          ))}
        </select>

        <input type="text" placeholder="Plot/Unit" name="plotUnit" value={formData.plotUnit} onChange={handleChange} />
        <input type="number" placeholder="Discount (%)" name="discount" value={formData.discount} onChange={handleChange} />
        
        <button type="submit">Add Customer</button>
      </form>
    </div>
  );
};

export default AddCustomerForm;

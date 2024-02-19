import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Customer.css'

const AddCustomerForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    fatherOrHusbandName: '',
    address: '',
    aadharNumber: '',
    panNumber: '',
    mobileNumber: '',
    income: '',
    email: '',
    propertyType: '',
    selectedProjectId: '',
    selectedBlockId: '',
    selectedUnitId: '',
    discount: '',
    paymentPlan: '',
    bookingDate: '',
    bookingType: '',
    sendEmail: false
  });

  const [projects, setProjects] = useState([]);
  const [showBlocks, setShowBlocks] = useState(false);
  const [showUnits, setShowUnits] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/getAllProjects`
      );
      const data = response.data;
      if (response.status === 200 && data.status === "ok") {
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
        console.error("Failed to fetch projects:", data.error);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const getUnitCount = async (projectId, blockId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/getUnitCount/${projectId}/${blockId}`
      );
      const data = response.data;
      if (response.status === 200 && data.status === "ok") {
        return data.unitCount;
      } else {
        console.error("Failed to get unit count:", data.error);
        return 0;
      }
    } catch (error) {
      console.error("Error getting unit count:", error);
      return 0;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Parse income and discount as numbers
      const parsedFormData = {
        ...formData,
        income: parseFloat(formData.income),
        discount: parseFloat(formData.discount)
      };
  
      const selectedProject = projects.find(project => project._id === formData.selectedProjectId);
      const selectedBlock = selectedProject?.blocks.find(block => block._id === formData.selectedBlockId);
      const selectedUnit = selectedBlock?.units.find(unit => unit._id === formData.selectedUnitId);

      const dataToSend = {
        ...parsedFormData,
        selectedProject,
        selectedBlock,
        selectedUnit
      };

      const response = await axios.post(`${process.env.REACT_APP_API_URL}/addCustomer`, dataToSend);
      
      if (response.status === 201) {
        console.log('Customer added successfully:', response.data);
        setFormData({
          name: '',
          fatherOrHusbandName: '',
          address: '',
          aadharNumber: '',
          panNumber: '',
          mobileNumber: '',
          income: '',
          email: '',
          propertyType: '',
          selectedProjectId: '',
          selectedBlockId: '',
          selectedUnitId: '',
          discount: '',
          paymentPlan: '',
          bookingDate: '',
          bookingType: '',
          sendEmail: false
        });
      } else {
        console.error('Failed to add customer:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding customer:', error);
    }
  };

  const handleClickProject = (projectId) => {
    setFormData({ ...formData, selectedProjectId: projectId });
    setShowBlocks(true);
    setShowUnits(false);
  };

  const handleClickBlock = (blockId) => {
    setFormData({ ...formData, selectedBlockId: blockId });
    setShowUnits(true);
  };

  const handleClickUnit = (unitId) => {
    setFormData({ ...formData, selectedUnitId: unitId });
  };

  return (
    <div className='main-content'>
      <h2 >Customer Form</h2>
      <form onSubmit={handleSubmit}>
        <div className='d-flex justify-content-between m-3'>
        <div class="relative">
  <input class="input-cal input-base" name="name" id="input" placeholder="" type="text" value={formData.name} onChange={handleInputChange} required/>
  <label id="label-input">Name</label>
</div>
<div className="relative">
  <input className="input-cal input-base" id="input" placeholder="" type="text" name="fatherOrHusbandName" value={formData.fatherOrHusbandName} onChange={handleInputChange}/>
  <label id="label-input">Fathers/Husband Name</label>
</div>
        </div>
        <div className='d-flex justify-content-between m-3'>
        <div className="relative">
  <input className="input-cal input-base" id="input" placeholder="" type="text" name="address" value={formData.address} onChange={handleInputChange}/>
  <label id="label-input">Address</label>
</div>
<div className="relative">
  <input className="input-cal input-base" id="input" placeholder="" type="number" name="aadharNumber" value={formData.aadharNumber} onChange={handleInputChange} />
  <label id="label-input">Adhar Number</label>
</div>
        </div>
        <div className='d-flex justify-content-between m-3'>
        <div className="relative">
  <input className="input-cal input-base" id="input" placeholder="" type="text" name="panNumber" value={formData.panNumber} onChange={handleInputChange}/>
  <label id="label-input">Pan Number</label>
</div>
<div className="relative">
  <input className="input-cal input-base" id="input" placeholder="" type="number" name="mobileNumber" value={formData.mobileNumber} onChange={handleInputChange}/> 
  <label id="label-input">Mobile Number</label>
</div>
       </div>
        <div className='d-flex justify-content-between m-3'>
        <div className="relative">
  <input className="input-cal input-base" id="input" placeholder="" type="text" name="income" value={formData.income} onChange={handleInputChange}/>  
  <label id="label-input">Income</label>
</div><div className="relative">
  <input className="input-cal input-base" id="input" placeholder="" type="text" name="email" value={formData.email} onChange={handleInputChange} required/>
  <label id="label-input">Email</label>
</div></div>
        <div className='d-flex justify-content-between m-3'>
        <div className="relative">
  <input className="input-cal input-base" id="input" placeholder="" type="text" name="propertyType" value={formData.propertyType} onChange={handleInputChange}/> 
  <label id="label-input">property Type</label>
</div>
        <div className="d-flex flex-wrap justify-content-between ">
          <select className='input-select' onChange={(e) => handleClickProject(e.target.value)}>
            <option value="">Select Project</option>
            {projects.map((project, index) => (
              <option key={index} value={project._id}>{project.name}</option>
            ))}
          </select>
          
          {showBlocks && formData.selectedProjectId && (
            <select className='input-select' onChange={(e) => handleClickBlock(e.target.value)}>
              <option value="">Select Block</option>
              {projects.find(project => project._id === formData.selectedProjectId)?.blocks.map((block, index) => (
                <option key={index} value={block._id}>{block.name}</option>
              ))}
            </select>
          )}
          
          {showUnits && formData.selectedBlockId && (
            <select className='input-select' onChange={(e) => handleClickUnit(e.target.value)}>
              <option value="">Select Unit</option>
              {projects
                .find(project => project._id === formData.selectedProjectId)
                ?.blocks.find(block => block._id === formData.selectedBlockId)
                ?.units.map((unit, index) => (
                  <option key={index} value={unit._id}>{unit.name}</option>
                ))}
            </select>
          )}
          </div>
        </div>
        <div className='d-flex justify-content-between m-3'>
        <div className="relative">
  <input className="input-cal input-base" id="input" placeholder="" type="text"name="discount" value={formData.discount} onChange={handleInputChange} />  
  <label id="label-input">Discount</label>
</div>

<div className="relative">
  <input className="input-cal input-base" id="input" placeholder="" type="text"name="paymentPlan" value={formData.paymentPlan} onChange={handleInputChange}/> 
  <label id="label-input">Payment Plan</label>
</div></div>
        <div className='d-flex justify-content-between m-3'>
        <div className="relative">
  <input className="input-cal input-base" id="input" placeholder="" type="date" name="bookingDate" value={formData.bookingDate} onChange={handleInputChange}/> 
  <label id="label-input">Booking Date</label>
</div><div className="relative">
  <input className="input-cal input-base" id="input" placeholder="" type="text" name="bookingType" value={formData.bookingType} onChange={handleInputChange}required/>
  <label id="label-input">Booking Type</label>
</div>
        </div>
        <label className='imput-name m-3'>
          <input type="checkbox" name="sendEmail"  checked={formData.sendEmail} onChange={handleCheckboxChange} />
          Send Email
        </label>
        <div className='d-flex justify-content-center'>
        <button type="submit" className='submitbutton'>Submit</button></div>
        
      </form>
    </div>
  );
};

export default AddCustomerForm;

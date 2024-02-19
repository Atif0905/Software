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
  const [plotSize, setPlotSize] = useState('');
  const [sizeType, setSizeType] = useState('');
  const [rate, setRate] = useState('');
  const [idcCharges, setIdcCharges] = useState('');
  const [plcCharges, setPlcCharges] = useState('');
  const [selectedBlockUnits, setSelectedBlockUnits] = useState([]);
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
  
      // Add a PUT request to mark the unit as sold
      const markUnitSoldResponse = await axios.put(`${process.env.REACT_APP_API_URL}/markUnitSold/${selectedProject._id}/${selectedBlock._id}/${selectedUnit._id}`);
      
      // If the unit is successfully marked as sold, proceed with adding the customer
      if (markUnitSoldResponse.status === 200 && markUnitSoldResponse.data.status === 'ok') {
        const addCustomerResponse = await axios.post(`${process.env.REACT_APP_API_URL}/addCustomer`, dataToSend);
        
        if (addCustomerResponse.status === 201) {
          console.log('Customer added successfully:', addCustomerResponse.data);
          alert('Customer Added Successfully');
          // Reset form data
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
            sendEmail: false,
            plotSize : '',
            rate : '',
            idcCharges : '',
            plcCharges : ''
          });
        } else {
          console.error('Failed to add customer:', addCustomerResponse.statusText);
        }
      } else {
        console.error('Failed to mark unit as sold:', markUnitSoldResponse.statusText);
      }
    } catch (error) {
      console.error('Error adding customer:', error);
    }
  };
  
  
  const handleClickBlock = (blockId) => {
    setFormData({ ...formData, selectedBlockId: blockId });
    setShowUnits(true);
  
    const selectedBlock = projects
      .find(project => project._id === formData.selectedProjectId)
      ?.blocks.find(block => block._id === blockId);
  
    if (selectedBlock) {
      // Filter out units that are already booked or sold
      const availableUnits = selectedBlock.units.filter(unit => unit.status !== 'Booked' && unit.status !== 'Sold');
      // Update state with available units
      setSelectedBlockUnits(availableUnits);
    }
  };
  const handleClickProject = (projectId) => {
    setFormData({ ...formData, selectedProjectId: projectId });
    setShowBlocks(true);
    setShowUnits(false);
  };

  

  const [selectedUnitId, setSelectedUnitId] = useState('');

  // const handleClickUnit = (unitId) => {
  //   setSelectedUnitId(unitId);
  //   setRate('');
  //     setIdcCharges('');
  //     setPlcCharges('');
  // };
  const handleClickUnit = (unitId) => {
    setFormData({ ...formData, selectedUnitId: unitId });
    const selectedUnit = projects
      .flatMap(project => project.blocks)
      .flatMap(block => block.units)
      .find(unit => unit._id === unitId);
    // Set values of plotSize, rate, idcCharges, plcCharges based on selectedUnit
    setPlotSize(selectedUnit?.plotSize || '');
    setRate(selectedUnit?.rate || '');
    setIdcCharges(selectedUnit?.idcCharges || '');
    setPlcCharges(selectedUnit?.plcCharges || '');
  }

  const handleUnitSelect = (e) => {
    const selectedUnitId = e.target.value;
    setSelectedUnitId(selectedUnitId);

    // Find the selected unit from projects state
    const selectedUnit = projects
      .flatMap(project => project.blocks)
      .flatMap(block => block.units)
      .find(unit => unit._id === selectedUnitId);
      const { idcCharges, plcCharges, rate, plotSize } = selectedUnit;
    if (selectedUnit) {
      // Update state variables with selected unit data
      setPlotSize(selectedUnit.plotSize);
      setSizeType(selectedUnit.sizeType);
      setRate(selectedUnit.rate);
      setIdcCharges(selectedUnit.idcCharges);
      setPlcCharges(selectedUnit.plcCharges);
    }
  };
  return (
    <div className='main-content'>
      <h2 >Applicant Details</h2>
      <form onSubmit={handleSubmit}>
        <div className='d-flex justify-content-between m-3'>
        <div class="relative">
  <input class="input-cal input-base" name="name" id="input" placeholder="" type="text" value={formData.name} onChange={handleInputChange} required/>
  <label id="label-input">Name</label>
</div>
<div className="relative">
  <input className="input-cal input-base" id="input" placeholder="" type="text" name="fatherOrHusbandName" value={formData.fatherOrHusbandName} onChange={handleInputChange} required />
  <label id="label-input">Fathers/Husband Name</label>
</div>
        </div>
        <div className='d-flex justify-content-between m-3'>
        <div className="relative">
  <input className="input-cal input-base" id="input" placeholder="" type="text" name="address" value={formData.address} onChange={handleInputChange} required/>
  <label id="label-input">Address</label>
</div>
<div className="relative">
  <input className="input-cal input-base" id="input" placeholder="" type="number" name="aadharNumber" value={formData.aadharNumber} onChange={handleInputChange} required />
  <label id="label-input">Adhar Number</label>
</div>
        </div>
        <div className='d-flex justify-content-between m-3'>
        <div className="relative">
  <input className="input-cal input-base" id="input" placeholder="" type="text" name="panNumber" value={formData.panNumber} onChange={handleInputChange} required />
  <label id="label-input">Pan Number</label>
</div>
<div className="relative">
  <input className="input-cal input-base" id="input" placeholder="" type="number" name="mobileNumber" value={formData.mobileNumber} onChange={handleInputChange} required /> 
  <label id="label-input">Mobile Number</label>
</div>
       </div>
        <div className='d-flex justify-content-between m-3'>
        <div className="relative">
  <input className="input-cal input-base" id="input" placeholder="" type="text" name="email" value={formData.email} onChange={handleInputChange} required/>
  <label id="label-input">Email</label>
</div></div>
        
        <h2>Property Details</h2>
        <div className='d-flex justify-content-between m-3'>
        <div className="relative">
  <input className="input-cal input-base" id="input" placeholder="" type="text" name="propertyType" value={formData.propertyType} onChange={handleInputChange} required /> 
  <label id="label-input">property Type</label>
</div>
<div className="relative">
  <input className="input-cal input-base" id="input" placeholder="" type="text" name="bookingType" value={formData.bookingType} onChange={handleInputChange}required/>
  <label id="label-input">Booking Type</label>
</div>
        </div>
        <div className='d-flex justify-content-between m-3'>
        <div className="relative">
  <input className="input-cal input-base" id="input" placeholder="" type="text"name="discount" value={formData.discount} onChange={handleInputChange} required />  
  <label id="label-input">Discount</label>
</div>

<div className="relative">
  <input className="input-cal input-base" id="input" placeholder="" type="text"name="paymentPlan" value={formData.paymentPlan} onChange={handleInputChange} required /> 
  <label id="label-input">Payment Plan</label>
</div>
</div>
        <div className='d-flex justify-content-between m-3'>
        <div className="relative">
  <input className="input-cal input-base" id="input" placeholder="" type="date" name="bookingDate" value={formData.bookingDate} onChange={handleInputChange} required /> 
  <label id="label-input">Booking Date</label>
</div>
<div className="d-flex flex-wrap justify-content-around ">
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
          
          {showUnits && selectedBlockUnits.length > 0 && (
  <select className='input-select' onChange={(e) => handleClickUnit(e.target.value)}>
    <option value="">Select Unit</option>
    {selectedBlockUnits
      .filter(unit => unit.status !== "sold" && unit.status !== "hold") // Filter out sold and hold units
      .map((unit, index) => (
        <option key={index} value={unit._id}>{unit.name}</option>
      ))}
  </select>
)}


          </div>
        </div>
        <div className='d-flex justify-content-between m-3'>
        <div className="relative">
  <input className="input-cal input-base" id="input" placeholder="" type="text" name="income" value={formData.income} onChange={handleInputChange} required/>  
  <label id="label-input">Income</label>
</div>
        <div className="container">
      <input type="checkbox" id="cbx2" name="sendEmail"  checked={formData.sendEmail} onChange={handleCheckboxChange} style={{ display: 'none' }} required />
      <label htmlFor="cbx2" className="check">
        <svg width="18px" height="18px" viewBox="0 0 18 18">
          <path d="M 1 9 L 1 9 c 0 -5 3 -8 8 -8 L 9 1 C 14 1 17 5 17 9 L 17 9 c 0 4 -4 8 -8 8 L 9 17 C 5 17 1 14 1 9 L 1 9 Z"></path>
          <polyline points="1 9 7 14 15 4"></polyline>
        </svg>
      </label>
      Send Email
    </div>
    </div>
    <div className='d-flex justify-content-between m-3'>
          <div className='relative'>
            <input
              type="number"
              className="input-cal input-base"
              id="input"
              placeholder=""
              value={plotSize}
              onChange={(e) => setPlotSize(e.target.value)}
              required
            />
            <label id="label-input">Plot size</label>
          </div>
          <div className='relative'>
            <input
              type="number"
              className="input-cal input-base"
              id="input"
              placeholder=""
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              required
            />
            <label id="label-input">Rate</label>
          </div>
        </div>
        <div className='d-flex justify-content-between m-3'>
          <div className='relative'>
            <input
              type="number"
              className="input-cal input-base"
              id="input"
              placeholder=""
              value={idcCharges}
              onChange={(e) => setIdcCharges(e.target.value)}
              required
            />
            <label id="label-input">IDC Charges</label>
          </div>
          <div className='relative'>
            <input
              type="number"
              className="input-cal input-base"
              id="input"
              placeholder=""
              value={plcCharges}
              onChange={(e) => setPlcCharges(e.target.value)}
              required
            />
            <label id="label-input">PLC Charges</label>
          </div>
        </div>
    
        <div className='d-flex justify-content-center'>
        <button type="submit" className='submitbutton'>Submit</button></div>
      </form>
    </div>
  );
};

export default AddCustomerForm;

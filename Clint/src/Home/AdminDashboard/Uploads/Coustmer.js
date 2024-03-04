import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Customer.css';

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
  const [paymentPlans, setPaymentPlans] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    const fetchPaymentPlans = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/paymentPlans`);
        setPaymentPlans(response.data.paymentPlans);
      } catch (error) {
        console.error('Error fetching payment plans:', error);
      }
    };
    fetchPaymentPlans();
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

          // If sendEmail checkbox is checked, send an email
          if (formData.sendEmail) {
            // Make a POST request to send the email
            const emailData = {
              to: formData.email,
              subject: 'Subject of the email',
              text: 'Body of the email',
            };
            const sendEmailResponse = await axios.post(`${process.env.REACT_APP_API_URL}/send-email`, emailData);

            if (sendEmailResponse.status === 200) {
              console.log('Email sent successfully');
            } else {
              console.error('Failed to send email:', sendEmailResponse.statusText);
            }
          }

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
  };

  return (
    <div className='main-content back'>
      <h3 className='Headtext'>Add a New Customer </h3>
      <form onSubmit={handleSubmit}>
      <h4 className='Headtext'>First Customer </h4>
        <div className='gridcontainer'>
          {/* Input fields for customer details */}
          <div className=" grid-item">
            <input 
              className="input-cal input-base" 
              id="input" 
              placeholder=" Enter Name" 
              type="text" 
              name="name" 
              value={formData.name.toUpperCase()} 
              onChange={handleInputChange} 
              required
            />
            <label id="label-input">Name</label>
          </div>
          <div className=" grid-item">
            <input 
              className="input-cal input-base" 
              id="input" 
              placeholder="Enter Father/HusbandName" 
              type="text" 
              name="fatherOrHusbandName" 
              value={formData.fatherOrHusbandName.toUpperCase()} 
              onChange={handleInputChange} 
              required
            />
            <label id="label-input">Father/Husband Name</label>
          </div>
          <div className=" grid-item">
            <input 
              className="input-cal input-base" 
              id="input" 
              placeholder="Enter Address" 
              type="text" 
              name="address" 
              value={formData.address.toUpperCase()} 
              onChange={handleInputChange} 
              required
            />
            <label id="label-input">Address</label>
          </div>
          <div className=" grid-item">
            <input 
              className="input-cal input-base" 
              id="input" 
              placeholder="Enter Aadhar Number" 
              type="number" 
              name="aadharNumber" 
              value={formData.aadharNumber} 
              onChange={handleInputChange} 
              required
            />
            <label id="label-input">Aadhar Number</label>
          </div>
          <div className=" grid-item">
            <input 
              className="input-cal input-base" 
              id="input" 
              placeholder="Enter Pan Number" 
              type="text" 
              name="panNumber" 
              value={formData.panNumber} 
              onChange={handleInputChange} 
              required
            />
            <label id="label-input">PAN Number</label>
          </div>
          <div className=" grid-item">
            <input 
              className="input-cal input-base" 
              id="input" 
              placeholder="Enter Mobile Number" 
              type="number" 
              name="mobileNumber" 
              value={formData.mobileNumber} 
              onChange={handleInputChange} 
              required
            />
            <label id="label-input">Mobile Number</label>
          </div>
          <div className=" grid-item">
            <input 
              className="input-cal input-base" 
              id="input" 
              placeholder="Enter Income" 
              type="text" 
              name="income" 
              value={formData.income.toUpperCase()} 
              onChange={handleInputChange} 
              required
            />
            <label id="label-input">Income</label>
          </div>
          <div className=" grid-item">
            <input 
              className="input-cal input-base" 
              id="input" 
              placeholder="Enter Email" 
              type="text" 
              name="email" 
              value={formData.email} 
              onChange={handleInputChange} 
              required
            />
            <label id="label-input">Email</label>
          </div>
          </div>
          {/* Property details */}
          <h4 className='Headtext mt-5'>Property Details</h4>
          <div className='gridcontainer'>
          
          <div className=" grid-item">
            <input 
              className="input-cal input-base" 
              id="input" 
              placeholder="Enter Property Type" 
              type="text" 
              name="propertyType" 
              value={formData.propertyType.toUpperCase()} 
              onChange={handleInputChange} 
              required
            />
            <label id="label-input">Property Type</label>
          </div>
          <div className=" grid-item">
            <input 
              className="input-cal input-base" 
              id="input" 
              placeholder="Enter Booking Type" 
              type="text" 
              name="bookingType" 
              value={formData.bookingType.toUpperCase()} 
              onChange={handleInputChange} 
              required
            />
            <label id="label-input">Booking Type</label>
          </div>
          <div className=" grid-item">
            <input 
              className="input-cal input-base" 
              id="input" 
              placeholder="Enter Discount " 
              type="text" 
              name="discount" 
              value={formData.discount.toUpperCase()} 
              onChange={handleInputChange} 
              required
            />
            <label id="label-input">Discount</label>
          </div>
          <div className=" grid-item">
      <select 
        className='input-cal input-base' 
        id="input" 
        name="paymentPlan" 
        value={formData.paymentPlan.toUpperCase()} 
        onChange={handleInputChange} 
        required
      >
        <option>Select plan</option>
        {paymentPlans.map((plan, index) => (
          <option key={index} value={plan.planName}>{plan.planName}</option>
        ))}
      </select>
      <label id="label-input">Payment Plan</label>
    </div>
          <div className="relative grid-item">
            <input 
              className="input-cal input-base" 
              id="input" 
              placeholder="Booking Date" 
              type="date" 
              name="bookingDate" 
              value={formData.bookingDate} 
              onChange={handleInputChange} 
              required
            />
            <label id="label-input">Booking Date</label>
          </div>

          {/* Select Project */}
          <div className="grid-item">
            <select 
              className='input-select' 
              onChange={(e) => handleClickProject(e.target.value)}
            >
              <option value="">Select Project</option>
              {projects.map((project, index) => (
                <option key={index} value={project._id}>{project.name}</option>
              ))}
            </select>
            
            {/* Show Blocks Dropdown */}
            {showBlocks && formData.selectedProjectId && (
              <select 
                className='input-select' 
                onChange={(e) => handleClickBlock(e.target.value)}
              >
                <option value="">Select Block</option>
                {projects.find(project => project._id === formData.selectedProjectId)?.blocks.map((block, index) => (
                  <option key={index} value={block._id}>{block.name}</option>
                ))}
              </select>
            )}
            
            {/* Show Units Dropdown */}
            {showUnits && selectedBlockUnits.length > 0 && (
              <select 
                className='input-select' 
                onChange={(e) => handleClickUnit(e.target.value)}
              >
                <option value="">Select Unit</option>
                {selectedBlockUnits
                  .filter(unit => unit.status !== "sold" && unit.status !== "hold") // Filter out sold and hold units
                  .map((unit, index) => (
                    <option key={index} value={unit._id}>{unit.name}</option>
                  ))}
              </select>
            )}
          </div>

          {/* Additional property details */}
          <div className=' grid-item'>
            <input
              type="number"
              className="input-cal input-base"
              id="input"
              placeholder="Enter Plot Size"
              value={plotSize}
              onChange={(e) => setPlotSize(e.target.value)}
              required
            />
            <label id="label-input">Plot size</label>
          </div>
          <div className=' grid-item'>
            <input
              type="number"
              className="input-cal input-base"
              id="input"
              placeholder="Enter Base Price"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              required
            />
            <label id="label-input">Base Price</label>
          </div>
          <div className=' grid-item'>
            <input
              type="number"
              className="input-cal input-base"
              id="input"
              placeholder="Enter IDC Charges"
              value={idcCharges}
              onChange={(e) => setIdcCharges(e.target.value)}
              required
            />
            <label id="label-input">IDC Charges</label>
          </div>
          <div className=' grid-item'>
            <input
              type="number"
              className="input-cal input-base"
              id="input"
              placeholder="Enter Plc Charges"
              value={plcCharges}
              onChange={(e) => setPlcCharges(e.target.value)}
              required
            />
            <label id="label-input">PLC Charges</label>
          </div>
          
          {/* Checkbox for sending email */}
          <div className="container mt-2 grid-item">
            <input 
              type="checkbox" 
              id="cbx2" 
              name="sendEmail"  
              checked={formData.sendEmail} 
              onChange={handleCheckboxChange} 
              style={{ display: 'none' }} 
              required 
            />
            <label htmlFor="cbx2" className="check">
              <svg width="18px" height="18px" viewBox="0 0 18 18">
                <path d="M 1 9 L 1 9 c 0 -5 3 -8 8 -8 L 9 1 C 14 1 17 5 17 9 L 17 9 c 0 4 -4 8 -8 8 L 9 17 C 5 17 1 14 1 9 L 1 9 Z"></path>
                <polyline points="1 9 7 14 15 4"></polyline>
              </svg>
            </label>
            Send Email
          </div>
        </div>
        <div className='mt-4'>
          <button type="submit" className="btn btn-primary ">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default AddCustomerForm;

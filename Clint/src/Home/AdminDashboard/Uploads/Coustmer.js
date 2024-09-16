import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Customer.css';
import ConfirmationModal from '../../../Confirmation/ConfirmationModal';
import { DateRangePicker } from 'react-date-range';
import { addDays } from 'date-fns';
import 'react-date-range/dist/styles.css'; 
import 'react-date-range/dist/theme/default.css'; 
const AddCustomerForm = () => {
  const [formData, setFormData] = useState({ name: '', title: '', fatherOrHusbandName: '', address: '', aadharNumber: '', panNumber: '', mobileNumber: '', income: '',  email: '', propertyType: '', selectedProjectId: '', selectedBlockId: '', selectedUnitId: '', discount: '', paymentPlan: '', bookingDate: '', bookingType: '', name2: '', fatherOrHusbandName2: '', address2: '', aadharNumber2: '', panNumber2 : '', mobileNumber2: '', email2: '', name3: '', fatherOrHusbandName3: '', address3: '', aadharNumber3: '', panNumber3: '', mobileNumber3: '', email3: '', EmployeeName: '', Teamleadname: '', permanentaddress: '', CreatedBy: '', DOB: '', DOB2: '', DOB3: '', AgreementDate: '', AllotmentDate: '', TenureStartDate: '', TenureEndDate: '', Tenuredays: '', sendEmail: false
  });
  const [projects, setProjects] = useState([]);
  const [showBlocks, setShowBlocks] = useState(false);
  const [showUnits, setShowUnits] = useState(false);
  const [plotSize, setPlotSize] = useState('');
  const [selectedBlockUnits, setSelectedBlockUnits] = useState([]);
  const [paymentPlans, setPaymentPlans] = useState([]);
  const [editedRate, setEditedRate] = useState('');
  const [editedPlcCharges, setEditedPlcCharges] = useState('');
  const [editedIdcCharges, setEditedIdcCharges] = useState('');
  const [editedEdcPrice, setEditedEdcPrice] = useState('');
  const [editedtotalPrice, setEditedTotalPrice] = useState();
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: 'selection'
    }
  ]);
  const [showSecondCustomer, setShowSecondCustomer] = useState(false);
const [showThirdCustomer, setShowThirdCustomer] = useState(false);
const [showConfirm, setShowConfirm] = useState(false);
  useEffect(() => {
    fetchProjects();
  }, []);
  useEffect(() => {
    const fetchPaymentPlans = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/paymentPlans`);
        console.log(response)
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
  const numberInputOnWheelPreventChange = (e) => {
    e.target.blur()
    e.stopPropagation()
    setTimeout(() => {
      e.target.focus()
    }, 0)
  }
  
  const handleSubmit = async (e) => {
    
    try {
      const generateUniqueEmail = (prefix = "random", domain = "example.com") => {
        const timestamp = Date.now();
        const randomNum = Math.floor(Math.random() * 1000);
        return `${prefix}${timestamp}${randomNum}@${domain}`;
      };
      const { startDate, endDate } = state[0];
      const formatDate = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };
      const parsedFormData = {
        ...formData,
        income: formData.income ? parseFloat(formData.income) : 'NA',
        discount: formData.discount ? parseFloat(formData.discount) : 'NA',
        aadharNumber: formData.aadharNumber || 'NA',
        panNumber: formData.panNumber || 'NA',
        mobileNumber: formData.mobileNumber || 'NA',
        email: formData.email || generateUniqueEmail(),
        name2: formData.name2 || 'NA',
        fatherOrHusbandName2: formData.fatherOrHusbandName2 || 'NA',
        address2: formData.address2 || 'NA',
        aadharNumber2: formData.aadharNumber2 || 'NA',
        panNumber2: formData.panNumber2 || 'NA',
        mobileNumber2: formData.mobileNumber2 || 'NA',
        email2: formData.email2 || generateUniqueEmail(),
        name3: formData.name3 || 'NA',
        fatherOrHusbandName3: formData.fatherOrHusbandName3 || 'NA',
        address3: formData.address3 || 'NA',
        aadharNumber3: formData.aadharNumber3 || 'NA',
        panNumber3: formData.panNumber3 || 'NA',
        mobileNumber3: formData.mobileNumber3 || 'NA',
        DOB: formData.DOB || 'NA',
        DOB2: formData.DOB2 || 'NA',
        DOB3: formData.DOB3 || 'NA',
        email3: formData.email3 || generateUniqueEmail(),
        TenureStartDate: formatDate(startDate) || 'NA',
        TenureEndDate: formatDate(endDate) || 'NA',
      };
      const startDateFormatted = new Date(parsedFormData.TenureStartDate);
    const endDateFormatted = new Date(parsedFormData.TenureEndDate);
    const tenureDays = Math.ceil((endDateFormatted - startDateFormatted) / (1000 * 60 * 60 * 24));
      const selectedProject = projects.find(project => project._id === formData.selectedProjectId);
      const selectedBlock = selectedProject?.blocks.find(block => block._id === formData.selectedBlockId);
      const selectedUnit = selectedBlock?.units.find(unit => unit._id === formData.selectedUnitId);
      const dataToSend = {
        ...parsedFormData,
        selectedProject,
        selectedBlock,
        selectedUnit,
        Tenuredays: tenureDays,
      };
      const markUnitSoldResponse = await axios.put(`${process.env.REACT_APP_API_URL}/markUnitSold/${selectedProject._id}/${selectedBlock._id}/${selectedUnit._id}`);
      if (markUnitSoldResponse.status === 200 && markUnitSoldResponse.data.status === 'ok') {
        const addCustomerResponse = await axios.post(`${process.env.REACT_APP_API_URL}/customer`, dataToSend);
        if (addCustomerResponse.status === 201) {
          if (formData.sendEmail) {
            const emailData = {
              to: formData.email,
              subject: 'Subject of the email',
              text: 'Body of the email',
              customerName:formData.name,
              customerAddress: formData.address,
              customerfather:formData.fatherOrHusbandName,
              unitName: selectedUnit.name, 
              unitArea: selectedUnit.plotSize, 
              ProjectName: selectedProject
            };
            const sendEmailResponse = await axios.post(`${process.env.REACT_APP_API_URL}/send-email`, emailData);

            if (sendEmailResponse.status === 200) {
            } else {
              console.error('Failed to send email:', sendEmailResponse.statusText);
            }
          }
          setFormData({ name: '', title: '', fatherOrHusbandName: '', address: '', aadharNumber: '', panNumber: '', mobileNumber: '', income: '', email: '', propertyType: '', selectedProjectId: '', selectedBlockId: '', selectedUnitId: '', discount: '', paymentPlan: '', bookingType: '', sendEmail: false, plotSize: '', rate: '', idcCharges: '', plcCharges: '', edcPrice: '', totalPrice: '', name2: '', fatherOrHusbandName2: '', address2: '', aadharNumber2: '', panNumber2: '', mobileNumber2: '', email2: '', name3: '', fatherOrHusbandName3: '', address3: '', aadharNumber3: '', panNumber3: '', mobileNumber3: '', email3: '', permanentaddress: '', EmployeeName: '', Teamleadname:'', CreatedBy: '', DOB: '', DOB2: '', DOB3: '', bookingDate: '', AgreementDate: '', AllotmentDate: '', TenureStartDate: '', TenureEndDate: '', Tenuredays: '',
          });
          await handleEditUnit();
        } else {
          alert("Failed To Add Customer")
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
      const availableUnits = selectedBlock.units.filter(unit => unit.status !== 'Booked' && unit.status !== 'Sold');
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
  
    if (selectedUnit) {
      setPlotSize(selectedUnit?.plotSize || '');
      setEditedRate(selectedUnit.rate || '');
      setEditedPlcCharges(selectedUnit.plcCharges || '');
      setEditedIdcCharges(selectedUnit.idcCharges || '');
      setEditedEdcPrice(selectedUnit.edcPrice || '');
      const editedTotal =
        (parseFloat(selectedUnit.rate || 0) + parseFloat(selectedUnit.plcCharges || 0) + parseFloat(selectedUnit.idcCharges || 0) + parseFloat(selectedUnit.edcPrice || 0)) * parseFloat(plotSize);
      setEditedTotalPrice(editedTotal);
    }
  };
  
  const handleEditUnit = async () => {
    try {
      const { selectedProjectId, selectedBlockId, selectedUnitId } = formData;

      const editedUnitData = {
        rate: editedRate,
        plcCharges: editedPlcCharges,
        idcCharges: editedIdcCharges,
        edcPrice: editedEdcPrice,
        totalPrice : editedtotalPrice,
      };
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/editUnit/${selectedProjectId}/${selectedBlockId}/${selectedUnitId}`, editedUnitData);

      if (response.status === 200) {
      } else {
        console.error('Failed to update unit:', response.data.error);
      }
    } catch (error) {
      console.error('Error updating unit:', error);
    }
  };


  const calculateEditedTotalPrice = () => {
    const editedTotal =
      (parseFloat(editedRate) + parseFloat(editedPlcCharges) + parseFloat(editedIdcCharges) + parseFloat(editedEdcPrice)) * parseFloat(plotSize);
    setEditedTotalPrice(editedTotal);
  };
  
  useEffect(() => {
    calculateEditedTotalPrice();
  }, [editedRate, editedPlcCharges, editedIdcCharges, editedEdcPrice, plotSize]);

  const handleToggleSecondCustomer = () => {
    setShowSecondCustomer(!showSecondCustomer);
  };
  
  const handleToggleThirdCustomer = () => {
    setShowThirdCustomer(!showThirdCustomer);
  };
  const handleSubmit1 = (e) => {
    e.preventDefault();
    setShowConfirm(true);
  };
  return (
    <div className='main-content back'>
      <div className='formback'>
      <h3 className='formhead'>Add a New Applicant </h3>
      <div className='p-3'>
        
        <h4 className='customerhead'><span>FIRST APPLICANT</span></h4>
      <form onSubmit={handleSubmit1}>
        <div className='gridcontainer'>
        <div className=" grid-item">
          <label>Prefix</label>
        <select type='text' name='title'  className="form-input-field" value={formData.title} onChange={handleInputChange} placeholder='Title' required>
                        <option value="">Select Option</option>
                        <option value="MR.">MR.</option>
                        <option value="MRS.">Mrs.</option>
                        <option value="Miss.">Miss.</option>
                    </select>
          </div>
          <div className=" grid-item">
            <label>Name</label>
            <input className="form-input-field" id="input" placeholder=" Enter Name" type="text" name="name" value={formData.name.toUpperCase()} onChange={handleInputChange} required />
          </div>
          <div className=" grid-item">
            <label>Father/Husband Name</label>
            <input className="form-input-field" id="input" placeholder="Enter Father/HusbandName" type="text" name="fatherOrHusbandName" value={formData.fatherOrHusbandName.toUpperCase()} onChange={handleInputChange} required />
          </div>
          <div className=" grid-item">
            <label>Present Address</label>
            <input className="form-input-field" id="input" placeholder="Enter Present Address" type="text" name="address" value={formData.address.toUpperCase()} onChange={handleInputChange} required />
          </div>
          <div className=" grid-item">
            <label>Permanent Address  </label>
            <input className="form-input-field" id="input" placeholder="Enter Permanent Address" type="text" name="permanentaddress" value={formData.permanentaddress.toUpperCase()} onChange={handleInputChange} required />
          </div>
          <div className=" grid-item">
            <label>Aadhaar Number </label>
            <input className="form-input-field" id="input" placeholder="Enter Aadhar Number" type="number" onWheel={numberInputOnWheelPreventChange} name="aadharNumber" value={formData.aadharNumber} onChange={handleInputChange} required />
          </div>
          <div className=" grid-item">
            <label>PAN Number </label>
            <input className="form-input-field" id="input" placeholder="Enter Pan Number" type="text" name="panNumber" value={formData.panNumber.toUpperCase()} onChange={handleInputChange} required />
          </div>
          <div className=" grid-item">
            <label>Mobile Number </label>
            <input className="form-input-field" id="input" placeholder="Enter Mobile Number" type="number" onWheel={numberInputOnWheelPreventChange} name="mobileNumber" value={formData.mobileNumber} onChange={handleInputChange} required />
          </div>
          <div className=" grid-item">
            <label>Income</label>
            <input className="form-input-field" id="input" placeholder="Enter Income" type="text" name="income" value={formData.income.toUpperCase()} onChange={handleInputChange} required />
          </div>
          <div className=" grid-item">
            <label>E-mail</label>
            <input className="form-input-field" id="input" placeholder="Enter Email" type="text" name="email" value={formData.email} onChange={handleInputChange} required />
          </div>
          <div className=" grid-item">
            <label>Date Of Birth</label>
            <input className="form-input-field" id="input" placeholder="Enter Date Of Birth" type="date" name="DOB" value={formData.DOB} onChange={handleInputChange} required/>
          </div>
        </div>
        <div>
        <button type="button" className="Addcustomerbutt mt-4" onClick={handleToggleSecondCustomer}> Second Applicant Details
</button></div>
{showSecondCustomer && (
        <>
        <div className='gridcontainer mt-2'>
        <div className=" grid-item">
          <label>Name</label>
            <input className="form-input-field" id="input" placeholder=" Enter Name" type="text" name="name2" value={formData.name2.toUpperCase()} onChange={handleInputChange} />
          </div>
          <div className=" grid-item">
            <label>Father/Husband Name</label>
            <input className="form-input-field" id="input" placeholder="Enter Father/HusbandName" type="text" name="fatherOrHusbandName2" value={formData.fatherOrHusbandName2.toUpperCase()} onChange={handleInputChange} />
          </div>
          <div className=" grid-item">
            <label>Permanent Address  </label>
            <input className="form-input-field" id="input" placeholder="Enter Address" type="text" name="address2" value={formData.address2.toUpperCase()} onChange={handleInputChange} />
          </div>
          <div className=" grid-item">
            <label>Aadhaar Number </label>
            <input className="form-input-field" id="input" placeholder="Enter Aadhar Number" type="number" onWheel={numberInputOnWheelPreventChange} name="aadharNumber2" value={formData.aadharNumber2} onChange={handleInputChange} />
          </div>
          <div className=" grid-item">
            <label>PAN Number </label>
            <input className="form-input-field" id="input" placeholder="Enter Pan Number" type="text" name="panNumber2" value={formData.panNumber2} onChange={handleInputChange} />
          </div>
          <div className=" grid-item">
            <label>Mobile Number </label>
            <input className="form-input-field" id="input" placeholder="Enter Mobile Number" type="number" onWheel={numberInputOnWheelPreventChange} name="mobileNumber2" value={formData.mobileNumber2} onChange={handleInputChange} />
          </div>
          <div className=" grid-item">
            <label>E-mail</label>
            <input className="form-input-field" id="input" placeholder="Enter Email" type="text" name="email2" value={formData.email2} onChange={handleInputChange} />
          </div>
          <div className=" grid-item">
            <label>Date Of Birth </label>
            <input className="form-input-field" id="input" placeholder="Enter DOB" type="date" name="DOB2" value={formData.DOB2} onChange={handleInputChange} required />
          </div>
            </div>
            </>
            )}
<button type="button" className="Addcustomerbutt mt-4" onClick={handleToggleThirdCustomer}>Third Applicant Details
</button>
{showThirdCustomer && (
  <>
            <div className='gridcontainer mt-2'>
            <div className=" grid-item">
              <label>Name</label>
            <input className="form-input-field" id="input" placeholder=" Enter Name" type="text" name="name3" value={formData.name3.toUpperCase()} onChange={handleInputChange} />
            </div>
          <div className=" grid-item">
            <label>Father/Husband Name</label>
            <input className="form-input-field" id="input" placeholder="Enter Father/HusbandName" type="text" name="fatherOrHusbandName3" value={formData.fatherOrHusbandName3.toUpperCase()} onChange={handleInputChange}               />
          </div>
          <div className=" grid-item">
            <label>Permanent Address  </label>
            <input className="form-input-field" id="input" placeholder="Enter Address" type="text" name="address3" value={formData.address3.toUpperCase()} onChange={handleInputChange}               />
          </div>
          <div className=" grid-item">
            <label>Aadhaar Number </label>
            <input className="form-input-field" id="input" placeholder="Enter Aadhar Number" type="number" onWheel={numberInputOnWheelPreventChange} name="aadharNumber3" value={formData.aadharNumber3} onChange={handleInputChange} />
          </div>
          <div className=" grid-item">
            <label>PAN Number </label>
            <input className="form-input-field" id="input" placeholder="Enter Pan Number" type="text" name="panNumber3" value={formData.panNumber3} onChange={handleInputChange} />
          </div>
          <div className=" grid-item">
            <label>Mobile Number </label>
            <input className="form-input-field" id="input" placeholder="Enter Mobile Number" type="number" onWheel={numberInputOnWheelPreventChange} name="mobileNumber3" value={formData.mobileNumber3} onChange={handleInputChange} />
          </div>
          <div className=" grid-item">
            <label>E-mail</label>
            <input className="form-input-field" id="input" placeholder="Enter Email" type="text" name="email3" value={formData.email3} onChange={handleInputChange} />
          </div>
          <div className=" grid-item">
            <label>Date Of Birth </label>
            <input className="form-input-field" id="input" placeholder="Enter DOB" type="date" name="DOB#" value={formData.DOB3} onChange={handleInputChange} required/>
          </div>
          </div>
          </>
)}
        <h4 className='customerhead mt-3'><span>Property Details</span></h4>
        <div className='gridcontainer'>
          <div className=" grid-item">
            <label>Property Type </label>
            <select className="form-input-field" id="input" name="propertyType" value={formData.propertyType} onChange={handleInputChange} required >
              <option value="">Select Property Type</option>
              <option value="Plot">Plot</option>
              <option value="Shop">Shop</option>
              <option value="Farmhouse Villa">Farmhouse Villa</option>
              <option value="Flat">Flat</option>
            </select>
          </div>
          <div className=" grid-item">
            <label>Booking Type</label>
            <select className="form-input-field" id="input" name="bookingType" value={formData.bookingType} onChange={handleInputChange} required>
              <option value="">Select Booking Type</option>
              <option value="Booking Confirmed">Booking Confirmed</option>
              <option value="Booking Hold">Booking Hold</option>
            </select>
          </div>
          <div className=" grid-item">
            <label>Created By</label>
            <select className="form-input-field" id="input" name="CreatedBy" value={formData.CreatedBy} onChange={handleInputChange} required >
              <option value="">Select Created By</option>
              <option value="Vijeta">Vijeta</option>
              <option value="Jyoti">Jyoti</option>
            </select>
          </div>
          <div className=" grid-item">
            <label>Employee Name</label>
            <select className="form-input-field" id="input" name="EmployeeName" value={formData.EmployeeName} onChange={handleInputChange} required >
              <option value="">Select Employee Name</option>
              <option value="Ankit Tonger">Ankit Tonger</option>
            </select>
          </div>
          <div className=" grid-item">
            <label>Team lead Name </label>
            <input className="form-input-field" id="input" placeholder="Enter Teamlead Name " type="text" name="Teamleadname" value={formData.Teamleadname.toUpperCase()} onChange={handleInputChange} required />
          </div>
          <div className=" grid-item">
            <label>Discount</label>
            <input className="form-input-field" id="input" placeholder="Enter Discount " type="text" name="discount" value={formData.discount.toUpperCase()} onChange={handleInputChange} required />
          </div>
          <div className="relative grid-item">
            <label>Agreement Date</label>
            <input className="form-input-field" id="input" placeholder="Enter Agreement Date" type="date" name="AgreementDate" value={formData.AgreementDate} onChange={handleInputChange} />
          </div>
          <div className="relative grid-item">
            <label>Allotment Date</label>
            <input className="form-input-field" id="input" placeholder="Allotment Date" type="date" name="AllotmentDate" value={formData.AllotmentDate} onChange={handleInputChange} />
          </div>
          <div className="relative grid-item">
            <label>Booking Date</label>
            <input className="form-input-field" id="input" placeholder="Booking Date" type="date" name="bookingDate" value={formData.bookingDate} onChange={handleInputChange} />
          </div>
          <div className="grid-item">
            <label>Plan</label>
            <select className="form-input-field" id="input" name="paymentPlan" value={formData.paymentPlan} onChange={handleInputChange} required >
              <option value="">Select plan</option>
              {paymentPlans.map((plan, index) => (
                <option key={index} value={plan.planName}>{plan.planName}</option>
              ))}
            </select>
          </div>
          <div className="grid-item">
            <label>Project</label>
            <select className='form-input-field' onChange={(e) => handleClickProject(e.target.value)}>
              <option value="">Select Project</option>
              {projects.map((project, index) => (
                <option key={index} value={project._id}>{project.name}</option>
              ))}
            </select>
            {showBlocks && formData.selectedProjectId && (
              <div>
              <label>Block</label>
              <select className='form-input-field' onChange={(e) => handleClickBlock(e.target.value)} >
                <option value="">Select Block</option>
                {projects.find(project => project._id === formData.selectedProjectId)?.blocks.map((block, index) => (
                  <option key={index} value={block._id}>{block.name}</option>
                ))}
              </select></div>
            )}
            {showUnits && selectedBlockUnits.length > 0 && (
              <div>
                <label>Unit</label>
              <select className='form-input-field' onChange={(e) => handleClickUnit(e.target.value)}>
                <option value="">Select Unit</option>
                {selectedBlockUnits
                  .filter(unit => unit.status !== "sold" && unit.status !== "hold") 
                  .map((unit, index) => (
                    <option key={index} value={unit._id}>{unit.name}</option>
                  ))}
              </select></div>
            )}
          </div>
          <div className=' grid-item'>
            <label>Plot Size</label>
            <input type="number" onWheel={numberInputOnWheelPreventChange} className="form-input-field" id="input" placeholder="Enter Plot Size" value={plotSize} onChange={(e) => setPlotSize(e.target.value)} required />
          </div>
          <div className=' grid-item'>
            <label>Base Price</label>
            <input type="number" onWheel={numberInputOnWheelPreventChange} className="form-input-field" id="input" placeholder="Enter Base Price" value={editedRate} onChange={(e) => setEditedRate(e.target.value)} required />
          </div>
          <div className=' grid-item'>
            <label>IDC Charge</label>
            <input type="number" onWheel={numberInputOnWheelPreventChange} className="form-input-field" id="input" placeholder="Enter IDC Charges" value={editedIdcCharges} onChange={(e) => setEditedIdcCharges(e.target.value)} required />
          </div>
          <div className=' grid-item'>
            <label>PLC Charge</label>
            <input type="number" onWheel={numberInputOnWheelPreventChange} className="form-input-field" id="input" placeholder="Enter Plc Charges" value={editedPlcCharges} onChange={(e) => setEditedPlcCharges(e.target.value)} required />
          </div>
          <div className=' grid-item'>
            <label>EDC Charge</label>
            <input type="number" onWheel={numberInputOnWheelPreventChange} className="form-input-field" id="input" placeholder="Enter EDC Charges" value={editedEdcPrice} onChange={(e) => setEditedEdcPrice(e.target.value)} required />
          </div>
          <div className='grid-item'>
            <label>Total Price</label>
          <input type="number" onWheel={numberInputOnWheelPreventChange} className="form-input-field" id='input' placeholder="Total Price" value={editedtotalPrice} onChange={(e) => setEditedTotalPrice(e.target.value)}  />
        </div>
          {/* <div className="container mt-2 grid-item">
            <input
              type="checkbox"
              id="cbx2"
              name="sendEmail"
              checked={formData.sendEmail}
              onChange={handleCheckboxChange}
              style={{ display: 'none' }}
            />
            <label htmlFor="cbx2" className="check">
              <svg width="18px" height="18px" viewBox="0 0 18 18">
                <path d="M 1 9 L 1 9 c 0 -5 3 -8 8 -8 L 9 1 C 14 1 17 5 17 9 L 17 9 c 0 4 -4 8 -8 8 L 9 17 C 5 17 1 14 1 9 L 1 9 Z"></path>
                <polyline points="1 9 7 14 15 4"></polyline>
              </svg>
            </label>
            Send Email
          </div> */}
        </div>
        <div className=" mt-3">
            <h4 className='customerhead'><span>Tenure Date</span></h4>
            <div className='center'>
            <DateRangePicker 
        onChange={item => setState([item.selection])}
        showSelectionPreview={true}
        moveRangeOnFirstSelection={false}
        months={1}
        ranges={state}
        direction="horizontal"
        required/></div>
          </div>
        <div className='center mt-4'>
          <button type="submit" className="addbutton " >Submit</button>
        </div>
        <ConfirmationModal show={showConfirm} onClose={() => setShowConfirm(false)} onConfirm={() => { setShowConfirm(false); handleSubmit(); }} message="Are you sure you want to add this Customer?"
          />
      </form>
    </div>
    </div>
    </div>
  );
};
export default AddCustomerForm;
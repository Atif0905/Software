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
    name2: '',
    fatherOrHusbandName2: '',
    address2: '',
    aadharNumber2: '',
    panNumber2 : '',
    mobileNumber2: '',
    email2: '',
    name3: '',
    fatherOrHusbandName3: '',
    address3: '',
    aadharNumber3: '',
    panNumber3: '',
    mobileNumber3: '',
    email3: '',
    sendEmail: false
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
  const [showSecondCustomer, setShowSecondCustomer] = useState(false);
const [showThirdCustomer, setShowThirdCustomer] = useState(false);

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
  const numberInputOnWheelPreventChange = (e) => {
    e.target.blur()
    e.stopPropagation()
    setTimeout(() => {
      e.target.focus()
    }, 0)
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const parsedFormData = {
        ...formData,
        income: formData.income ? parseFloat(formData.income) : 'NA',
        discount: formData.discount ? parseFloat(formData.discount) : 'NA',
        aadharNumber: formData.aadharNumber || 'NA',
        panNumber: formData.panNumber || 'NA',
        mobileNumber: formData.mobileNumber || 'NA',
        email: formData.email || 'NA',
        name2: formData.name2 || 'NA',
        fatherOrHusbandName2: formData.fatherOrHusbandName2 || 'NA',
        address2: formData.address2 || 'NA',
        aadharNumber2: formData.aadharNumber2 || 'NA',
        panNumber2: formData.panNumber2 || 'NA',
        mobileNumber2: formData.mobileNumber2 || 'NA',
        email2: formData.email2 || 'NA',
        name3: formData.name3 || 'NA',
        fatherOrHusbandName3: formData.fatherOrHusbandName3 || 'NA',
        address3: formData.address3 || 'NA',
        aadharNumber3: formData.aadharNumber3 || 'NA',
        panNumber3: formData.panNumber3 || 'NA',
        mobileNumber3: formData.mobileNumber3 || 'NA',
        email3: formData.email3 || 'NA',
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
      const markUnitSoldResponse = await axios.put(`${process.env.REACT_APP_API_URL}/markUnitSold/${selectedProject._id}/${selectedBlock._id}/${selectedUnit._id}`);
      if (markUnitSoldResponse.status === 200 && markUnitSoldResponse.data.status === 'ok') {
        const addCustomerResponse = await axios.post(`${process.env.REACT_APP_API_URL}/addCustomer`, dataToSend);
        if (addCustomerResponse.status === 201) {
          alert('Customer Added Successfully');
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
            plotSize: '',
            rate: '',
            idcCharges: '',
            plcCharges: '',
            edcPrice: '',
            totalPrice: '',
            name2: '',
            fatherOrHusbandName2: '',
            address2: '',
            aadharNumber2: '',
            panNumber2: '',
            mobileNumber2: '',
            email2: '',
            name3: '',
            fatherOrHusbandName3: '',
            address3: '',
            aadharNumber3: '',
            panNumber3: '',
            mobileNumber3: '',
            email3: '',
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
      // Automatically fill input fields with old data
      setPlotSize(selectedUnit?.plotSize || '');
      setEditedRate(selectedUnit.rate || '');
      setEditedPlcCharges(selectedUnit.plcCharges || '');
      setEditedIdcCharges(selectedUnit.idcCharges || '');
      setEditedEdcPrice(selectedUnit.edcPrice || '');
      // Calculate the total price based on the new edited values
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
  
  return (
    <div className='main-content back'>
      <h3 className='Headtext'>Add a New Customer </h3>
      <form onSubmit={handleSubmit}>
        <h4 className='Headtext'>First Customer </h4>
        <div className='gridcontainer'>
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
              onWheel={numberInputOnWheelPreventChange}
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
              onWheel={numberInputOnWheelPreventChange}
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
        <div>
        <button type="button" className="Addcustomerbutt mt-4" onClick={handleToggleSecondCustomer}>Add Second Customer Details
</button></div>
{showSecondCustomer && (
        <>
        <h3 className='Headtext'> Second Customer </h3>
        <div className='gridcontainer mt-2'>
        <div className=" grid-item">
            <input
              className="input-cal input-base"
              id="input"
              placeholder=" Enter Name"
              type="text"
              name="name2"
              value={formData.name2.toUpperCase()}
              onChange={handleInputChange}
              
            />
            <label id="label-input">Name</label>
          </div>
          <div className=" grid-item">
            <input
              className="input-cal input-base"
              id="input"
              placeholder="Enter Father/HusbandName"
              type="text"
              name="fatherOrHusbandName2"
              value={formData.fatherOrHusbandName2.toUpperCase()}
              onChange={handleInputChange}
              
            />
            <label id="label-input">Father/Husband Name</label>
          </div>
          <div className=" grid-item">
            <input
              className="input-cal input-base"
              id="input"
              placeholder="Enter Address"
              type="text"
              name="address2"
              value={formData.address2.toUpperCase()}
              onChange={handleInputChange}
              
            />
            <label id="label-input">Address</label>
          </div>
          <div className=" grid-item">
            <input
              className="input-cal input-base"
              id="input"
              placeholder="Enter Aadhar Number"
              type="number"
              onWheel={numberInputOnWheelPreventChange}
              name="aadharNumber2"
              value={formData.aadharNumber2}
              onChange={handleInputChange}
              
            />
            <label id="label-input">Aadhar Number</label>
          </div>
          <div className=" grid-item">
            <input
              className="input-cal input-base"
              id="input"
              placeholder="Enter Pan Number"
              type="text"
              name="panNumber2"
              value={formData.panNumber2}
              onChange={handleInputChange}
              
            />
            <label id="label-input">PAN Number</label>
          </div>
          <div className=" grid-item">
            <input
              className="input-cal input-base"
              id="input"
              placeholder="Enter Mobile Number"
              type="number"
              onWheel={numberInputOnWheelPreventChange}
              name="mobileNumber2"
              value={formData.mobileNumber2}
              onChange={handleInputChange}
              
            />
            <label id="label-input">Mobile Number</label>
          </div>
          <div className=" grid-item">
            <input
              className="input-cal input-base"
              id="input"
              placeholder="Enter Email"
              type="text"
              name="email2"
              value={formData.email2}
              onChange={handleInputChange}
              
            />
            <label id="label-input">Email</label>
          </div>
            </div>
            </>
            )}
<button type="button" className="Addcustomerbutt mt-4" onClick={handleToggleThirdCustomer}>Add Third Customer Details
</button>
{showThirdCustomer && (
  <>
            <h3 className='Headtext'>Third Customer</h3>
            <div className='gridcontainer mt-2'>
            <div className=" grid-item">
            <input
              className="input-cal input-base"
              id="input"
              placeholder=" Enter Name"
              type="text"
              name="name3"
              value={formData.name3.toUpperCase()}
              onChange={handleInputChange}
              
            />
            </div>
            <label id="label-input">Name</label>  

          <div className=" grid-item">
            <input
              className="input-cal input-base"
              id="input"
              placeholder="Enter Father/HusbandName"
              type="text"
              name="fatherOrHusbandName3"
              value={formData.fatherOrHusbandName3.toUpperCase()}
              onChange={handleInputChange}
              
            />
            <label id="label-input">Father/Husband Name</label>
          </div>
          <div className=" grid-item">
            <input
              className="input-cal input-base"
              id="input"
              placeholder="Enter Address"
              type="text"
              name="address3"
              value={formData.address3.toUpperCase()}
              onChange={handleInputChange}
              
            />
            <label id="label-input">Address</label>
          </div>
          <div className=" grid-item">
            <input
              className="input-cal input-base"
              id="input"
              placeholder="Enter Aadhar Number"
              type="number"
              onWheel={numberInputOnWheelPreventChange}
              name="aadharNumber3"
              value={formData.aadharNumber3}
              onChange={handleInputChange}
              
            />
            <label id="label-input">Aadhar Number</label>
          </div>
          <div className=" grid-item">
            <input
              className="input-cal input-base"
              id="input"
              placeholder="Enter Pan Number"
              type="text"
              name="panNumber3"
              value={formData.panNumber3}
              onChange={handleInputChange}
              
            />
            <label id="label-input">PAN Number</label>
          </div>
          <div className=" grid-item">
            <input
              className="input-cal input-base"
              id="input"
              placeholder="Enter Mobile Number"
              type="number"
              onWheel={numberInputOnWheelPreventChange}
              name="mobileNumber3"
              value={formData.mobileNumber3}
              onChange={handleInputChange}
              
            />
            <label id="label-input">Mobile Number</label>
          </div>
          <div className=" grid-item">
            <input
              className="input-cal input-base"
              id="input"
              placeholder="Enter Email"
              type="text"
              name="email3"
              value={formData.email3}
              onChange={handleInputChange}
              
            />
            <label id="label-input">Email</label>
          </div>
          </div>
          </>
)}
        <h4 className='Headtext mt-5'>Property Details</h4>
        <div className='gridcontainer'>
          <div className=" grid-item">
            <select
              className="input-cal input-base"
              id="input"
              name="propertyType"
              value={formData.propertyType}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Property Type</option>
              <option value="Plot">Plot</option>
              <option value="Shop">Shop</option>
              <option value="Farmhouse Villa">Farmhouse Villa</option>
              <option value="Flat">Flat</option>
            </select>
          </div>
          <div className=" grid-item">
            <select
              className="input-cal input-base"
              id="input"
              name="bookingType"
              value={formData.bookingType}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Booking Type</option>
              <option value="Booking Confirmed">Booking Confirmed</option>
              <option value="Booking Hold">Booking Hold</option>
            </select>
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
          <div className="grid-item">
            <select
              className="input-cal input-base"
              id="input"
              name="paymentPlan"
              value={formData.paymentPlan}
              onChange={handleInputChange}
              required
            >
              <option value="">Select plan</option>
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
            {showUnits && selectedBlockUnits.length > 0 && (
              <select
                className='input-select'
                onChange={(e) => handleClickUnit(e.target.value)}
              >
                <option value="">Select Unit</option>
                {selectedBlockUnits
                  .filter(unit => unit.status !== "sold" && unit.status !== "hold") 
                  .map((unit, index) => (
                    <option key={index} value={unit._id}>{unit.name}</option>
                  ))}
              </select>
            )}
          </div>
          <div className=' grid-item'>
            <input
              type="number"
              onWheel={numberInputOnWheelPreventChange}
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
              onWheel={numberInputOnWheelPreventChange}
              className="input-cal input-base"
              id="input"
              placeholder="Enter Base Price"
              value={editedRate}
              onChange={(e) => setEditedRate(e.target.value)}
              required
            />
            <label id="label-input">Base Price</label>
          </div>
          <div className=' grid-item'>
            <input
              type="number"
              onWheel={numberInputOnWheelPreventChange}
              className="input-cal input-base"
              id="input"
              placeholder="Enter IDC Charges"
              value={editedIdcCharges}
              onChange={(e) => setEditedIdcCharges(e.target.value)}
              required
            />
            <label id="label-input">IDC Charges</label>
          </div>
          <div className=' grid-item'>
            <input
              type="number"
              onWheel={numberInputOnWheelPreventChange}
              className="input-cal input-base"
              id="input"
              placeholder="Enter Plc Charges"
              value={editedPlcCharges}
              onChange={(e) => setEditedPlcCharges(e.target.value)}
              required
            />
            <label id="label-input">PlC Charges</label>
          </div>
          <div className=' grid-item'>
            <input
              type="number"
              onWheel={numberInputOnWheelPreventChange}
              className="input-cal input-base"
              id="input"
              placeholder="Enter EDC Charges"
              value={editedEdcPrice}
              onChange={(e) => setEditedEdcPrice(e.target.value)}
              required
            />
            <label id="label-input">EDC Charges</label>
          </div>
          <div className='grid-item'>
          <input type="number" onWheel={numberInputOnWheelPreventChange} className="input-cal input-base" id='input' placeholder="Total Price" value={editedtotalPrice} onChange={(e) => setEditedTotalPrice(e.target.value)}  />
          <label id="label-input">Total Price</label>
        </div>
          <div className="container mt-2 grid-item">
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
          </div>
        </div>


        <div className='mt-4'>
          <button type="submit" className="btn btn-primary " >Submit</button>
        </div>
      </form>
    </div>
  );
};
export default AddCustomerForm;
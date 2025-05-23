import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ConfirmationModal from '../../Confirmation/ConfirmationModal';
import { useNavigate } from 'react-router-dom';
const Editcustomerdetails = () => {
    const { _id } = useParams();
    const [customer, setCustomer] = useState(null);
    const navigate = useNavigate();
    const [updateStatus, setUpdateStatus] = useState(null);
    const [editedCustomer, setEditedCustomer] = useState({
        title: '',
        name: '',
        fatherOrHusbandName: '',
        address: '',
        aadharNumber: '',
        bookingDate: '',
        panNumber: '',
        mobileNumber: '',
        email: '',
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
        DOB: '',
        AgreementDate: '',
        AllotmentDate: '',
        Teamleadname: '',
        email3: '',
        status: ''
    });
    const [showConfirm, setShowConfirm] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [errorModal, setErrorModal] = useState(false);
    useEffect(() => {
        const fetchCustomerData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/customer`);
                const customers = response.data;
                const matchedCustomer = customers.find(cust => cust._id === _id);
                if (matchedCustomer) {
                    setCustomer(matchedCustomer);
                    const { customerId, ...editableCustomer } = matchedCustomer;
                    setEditedCustomer(editableCustomer);
                } else {
                    console.error('Customer not found with ID:', _id);
                }
            } catch (error) {
                console.error('Error fetching customer data:', error);
            }
        };

        if (_id) {
            fetchCustomerData();
        }
    }, [_id]);
    useEffect(() => {
        if (updateStatus === 'success') {
            navigate('/Viewcustomer');
        }
    }, [updateStatus, navigate]);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedCustomer(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    const handleSubmit = async (e) => {
        const updatedCustomerNA = { ...editedCustomer };
        Object.keys(updatedCustomerNA).forEach((key) => {
            if (updatedCustomerNA[key] === '') {
                updatedCustomerNA[key] = 'NA';
            }
        });
    
        try {
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/customer/${_id}`, updatedCustomerNA);
            console.log('Customer updated:', response.data);
            setUpdateStatus('success');
            const updatedCustomer = response.data;
            setCustomer(updatedCustomer);
        } catch (error) {
            console.error('Error updating customer:', error);
            setUpdateStatus('error');
        }
    };
    const handleSubmit1 = (e) => {
        e.preventDefault();
        setShowConfirm(true);
    };
    const closeModal = () => {
        setShowModal(false);
      };
      const closeErrorModal = () => {
        setErrorModal(false);
      };
    return (
        <div className='main-content'>
            {customer && (
                <form onSubmit={handleSubmit1}>
                    <div className='formback'>
                        <h3 className='formhead'>Update Customer {customer && customer.name && customer.name.toUpperCase()}- {customer && customer.customerId}</h3>
                        <div className='p-3'>
                            <div className='gridcontainer'>
                                <div className='grid-item'>
                                    <label>Prefix</label>
                                    <select type='text' className='form-input-field' name='title' value={editedCustomer.title} onChange={handleChange} placeholder='Name' required>
                                        <option>Select Option</option>
                                        <option>MR.</option>
                                        <option>Mrs.</option>
                                        <option>Miss</option>
                                    </select>
                                </div>
                                <div className='grid-item'>
                                    <label>Name</label>
                                    <input className='form-input-field' type='text' name='name' value={editedCustomer.name} onChange={handleChange} placeholder='Name' required />
                                </div>
                                <div className='grid-item'>
                                    <label>Father/Husband Name</label>
                                    <input className='form-input-field' type='text' name='fatherOrHusbandName' value={editedCustomer.fatherOrHusbandName} onChange={handleChange} placeholder='fatherOrHusbandName' required />
                                </div>
                                <div className='grid-item'>
                                    <label>Present Address</label>
                                    <input className='form-input-field' type='text' name='address' value={editedCustomer.address} onChange={handleChange} placeholder='address' required />
                                </div>
                                <div className='grid-item'>
                                    <label>Aadhaar Number</label>
                                    <input className='form-input-field' type="number" name='aadharNumber' value={editedCustomer.aadharNumber} onChange={handleChange} placeholder='aadharNumber' required />
                                </div>
                                <div className='grid-item'>
                                    <label>E-mail</label>
                                    <input className='form-input-field' type="text" name='email' value={editedCustomer.email} onChange={handleChange} placeholder='email' required />
                                </div>
                                <div className='grid-item'>
                                    <label>PAN Number</label>
                                    <input className='form-input-field' type='text' name='panNumber' value={editedCustomer.panNumber} onChange={handleChange} placeholder='panNumber' required />
                                </div>
                                <div className='grid-item'>
                                    <label>Mobile Number</label>
                                    <input className='form-input-field' type="number" name='mobileNumber' value={editedCustomer.mobileNumber} onChange={handleChange} placeholder='mobileNumber' required />
                                </div>
                                <div className='grid-item'>
                                    <label>DOB </label>
                                    <input className='form-input-field' type="date" name='DOB' value={editedCustomer.DOB} onChange={handleChange} placeholder='DOB' />
                                </div>

                                <div className="relative grid-item">
                                    <label>Allotment Date</label>
                                    <input className='form-input-field' id="input" placeholder="Allotment Date" type="date" name="AllotmentDate" value={editedCustomer.AllotmentDate} onChange={handleChange}
                                    />
                                </div>
                                <div className="relative grid-item">
                                    <label>Agreement Date</label>
                                    <input className='form-input-field' id="input" placeholder="Enter Agreement Date" type="date" name="AgreementDate" value={editedCustomer.AgreementDate} onChange={handleChange} />
                                </div>
                                <div className="relative grid-item">
                                    <label>Agreement Date</label>
                                    <input className='form-input-field' id="input" placeholder="Enter Agreement Date" type="text" name="Teamleadname" value={editedCustomer.Teamleadname.toUpperCase()} onChange={handleChange} />
                                </div>
                            </div>
                            <h3 className='Headtext'>Second Customer</h3>
                            <div className='gridcontainer '>
                                <div className='grid-item'>
                                    <label>Name</label>
                                    <input className='form-input-field' type='text' name='name2' value={editedCustomer.name2} onChange={handleChange} placeholder='Name' />
                                </div>
                                <div className='grid-item'>
                                    <label>Father/Husband Name</label>
                                    <input className='form-input-field' type='text' name='fatherOrHusbandName2' value={editedCustomer.fatherOrHusbandName2} onChange={handleChange} placeholder='fatherOrHusbandName' />
                                </div>
                                <div className='grid-item'>
                                    <label>Address</label>
                                    <input className='form-input-field' type='text' name='address2' value={editedCustomer.address2} onChange={handleChange} placeholder='address' />
                                </div>
                                <div className='grid-item'>
                                    <label>Aadhaar Number</label>
                                    <input className='form-input-field' type="number" name='aadharNumber2' value={editedCustomer.aadharNumber2} onChange={handleChange} placeholder='aadharNumber' />
                                </div>
                                <div className='grid-item'>
                                    <label>E-mail</label>
                                    <input className='form-input-field' type="text" name='email2' value={editedCustomer.email2} onChange={handleChange} placeholder='email' />
                                </div>
                                <div className='grid-item'>
                                    <label>PAN Number</label>
                                    <input className='form-input-field' type='text' name='panNumber2' value={editedCustomer.panNumber2} onChange={handleChange} placeholder='panNumber' />
                                </div>
                                <div className='grid-item'>
                                    <label>Mobile Number</label>
                                    <input className='form-input-field' type="number" name='mobileNumber2' value={editedCustomer.mobileNumber2} onChange={handleChange} placeholder='mobileNumber' />
                                </div>
                            </div>
                            <h3 className='Headtext'>Third Customer</h3>
                            <div className='gridcontainer'>
                                <div className='grid-item'>
                                    <label>Name</label>
                                    <input className='form-input-field' type='text' name='name3' value={editedCustomer.name3} onChange={handleChange} placeholder='Name' />
                                </div>
                                <div className='grid-item'>
                                    <label>Father/Husband Name</label>
                                    <input className='form-input-field' type='text' name='fatherOrHusbandName3' value={editedCustomer.fatherOrHusbandName3} onChange={handleChange} placeholder='fatherOrHusbandName' />
                                </div>
                                <div className='grid-item'>
                                    <label>Address</label>
                                    <input className='form-input-field' type='text' name='address3' value={editedCustomer.address3} onChange={handleChange} placeholder='address' />
                                </div>
                                <div className='grid-item'>
                                    <label>Aadhaar Number</label>
                                    <input className='form-input-field' type="number" name='aadharNumber3' value={editedCustomer.aadharNumber3} onChange={handleChange} placeholder='aadharNumber' />
                                </div>
                                <div className='grid-item'>
                                    <label>E-mail</label>
                                    <input className='form-input-field' type='text' name='email3' value={editedCustomer.email3} onChange={handleChange} placeholder='email' />
                                </div>
                                <div className='grid-item'>
                                    <label>PAN Number</label>
                                    <input className='form-input-field' type='text' name='panNumber3' value={editedCustomer.panNumber3} onChange={handleChange} placeholder='panNumber' />
                                </div>
                                <div className='grid-item'>
                                    <label>Mobile Number</label>
                                    <input className='form-input-field' type="number" name='mobileNumber3' value={editedCustomer.mobileNumber3} onChange={handleChange} placeholder='mobileNumber' />
                                </div>
                                <div className='grid-item'>
                    <label>Do You want To Cancel?</label>
                    <select type='text' className='input-cal input-base' name='status' value={editedCustomer.status} onChange={handleChange} placeholder='Name' required>
                        <option>Select Option</option>
                        <option>Current</option>
                        <option>Canceled</option>
                    </select>
                    </div>
                            </div>
                        </div>
                        <div className='center'><button type="submit" className='addbutton mt-4'>Update Customer</button></div>
                        <ConfirmationModal show={showConfirm}
                            onClose={() => setShowConfirm(false)}
                            onConfirm={() => {
                                setShowConfirm(false);
                                handleSubmit();
                            }}
                            message="Are you sure you Update These details"
                        />
                    </div>
                </form>
            )}
                {showModal && (
        <div className="homemodal">
          <div className="homemodal-content">
            <p>Customer Details Updated Successfully</p>
            <button onClick={closeModal}>Ok</button>
          </div>
        </div>
      )}
      {errorModal && (
        <div className="homemodal">
          <div className="homemodal-content">
            <p>{errorMessage}</p>
            <button onClick={closeErrorModal}>Ok</button>
          </div>
        </div>
      )}
        </div>
    );
};

export default Editcustomerdetails;

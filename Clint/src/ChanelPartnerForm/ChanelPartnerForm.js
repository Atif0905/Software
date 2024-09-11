import React, { useState } from 'react';
import axios from 'axios';
import './Chanel.css';
import Nav from './Nav';
import ConfirmationModal from '../Confirmation/ConfirmationModal';

const ChanelPartnerForm = () => {
  const [formData, setFormData] = useState({
    customerFirstName: '',
    customerSecondName: '',
    customerEmail: '',
    gender: '',
    phoneNumber: '',
    referredBy: '',
  });
  
  const [error, setError] = useState('');
  const [showConfirm, setShowConfirm] = useState(false); 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
  
    console.log('Form Data: ', formData);
  
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/channelpartner`, formData);
      setError('');
    } catch (err) {
      console.error("Error response from server: ", err);
      if (err.response && err.response.status === 400) {
        setError(err.response.data.error);
      } else {
        setError('Error creating Channel Partner');
      }
    }
  };
  const handleSubmit1 = (e) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  return (
    <div>
      <Nav />
      <div className="Heroimg">
        <h1 className="head">CHANNEL PARTNER REGISTRATION</h1>
        <h2 className="head2">Building Success Together - Become Our Channel Partner</h2>
      </div>

      <div className="back1">
        <div className="container">
          <div className="formcontainer">
            <div className="formdiv">
              <img src="./contactimg.png" className="contactimg" alt="Contact" />
              <p className="text">Our Team will respond to your Query</p>
              <div className="butdiv">
                <p className="but">+91 9911140024</p>
              </div>
            </div>

            <div className="formdiv">
              <div className="formfilldiv">
              <form onSubmit={handleSubmit1}>
        <div>
          <input
            type="text"
            name="customerFirstName"
            className="filldiv"
            placeholder='Enter Your First Name'
            value={formData.customerFirstName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            type="text"
            name="customerSecondName"
            className="filldiv"            
            placeholder='Enter Your Last Name'
            value={formData.customerSecondName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            type="email"
            name="customerEmail"
            className="filldiv"            
            placeholder='Enter Your Email'
            value={formData.customerEmail}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="filldiv"
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <input
            type="text"
            name="phoneNumber"
            placeholder='Enter Your Phone Number'
            className="filldiv"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            type="text"
            name="referredBy"
            className="filldiv"            
            placeholder='Refered By'
            value={formData.referredBy}
            onChange={handleChange}
          />
        </div>
        <div className="butdiv">
                    <button className="but2" type="submit">SUBMIT</button>
                    <ConfirmationModal show={showConfirm} onClose={() => setShowConfirm(false)} onConfirm={() => {  setShowConfirm(false);  handleSubmit(); }} message="Are you sure you want to Submit this form" />
                  </div>
      </form>
              </div>
            </div>
          </div>
        </div>

        <div className="container mb-5">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3505.8953182297437!2d77.40831987549643!3d28.512797075730326!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce9fcbe0273a1%3A0xd8ed754838e2f8a4!2sBhutani%20Alphathum!5e0!3m2!1sen!2sin!4v1725870704125!5m2!1sen!2sin"
            width="100%"
            height="450"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default ChanelPartnerForm;

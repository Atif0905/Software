import React, { useState } from 'react';
import axios from 'axios';
import './Chanel.css';
import Nav from './Nav';

const ChanelPartnerForm = () => {
  const [formData, setFormData] = useState({
    customerfirstName: '',
    customerSecondName: '',
    customerEmail: '',
    gender: '',
    Referedby: '',  // This should be capital 'R'
    phoneNumber: '',
  });
  

  const [responseMessage, setResponseMessage] = useState('');
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/chanelpartner`, formData);
      setResponseMessage('Registration successful!');
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 2xx
        console.error('Error response data:', error.response.data);
        console.error('Error status:', error.response.status);
        setResponseMessage(`Failed to register: ${error.response.data.message || 'Please try again.'}`);
      } else {
        setResponseMessage('Failed to register. Please try again.');
        console.error('Error sending request:', error);
      }
    }
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
                <form onSubmit={handleSubmit}>
                  <div>
                    <input
                      type="text"
                      id="customerfirstName"
                      name="customerfirstName"
                      className="filldiv"
                      value={formData.customerfirstName}
                      onChange={handleChange}
                      placeholder="Enter Your First Name"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      id="customerSecondName"
                      name="customerSecondName"
                      className="filldiv"
                      value={formData.customerSecondName}
                      onChange={handleChange}
                      placeholder="Enter Your Last Name"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      id="customerEmail"
                      name="customerEmail"
                      className="filldiv"
                      value={formData.customerEmail}
                      onChange={handleChange}
                      placeholder="Enter Your Email"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      id="phoneNumber"
                      name="phoneNumber"
                      className="filldiv"
                      placeholder="Enter your Contact Number"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      id="Referedby"
                      name="Referedby"
                      className="filldiv"
                      placeholder="Referred By"
                      value={formData.Referedby} // lowercase `referedby`
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <select
                      id="gender"
                      name="gender"
                      className="filldiv"
                      value={formData.gender}
                      onChange={handleChange}
                      required
                    >
                      <option value="" disabled>Select Gender</option>
                      <option key="male" value="Male">Male</option>
                      <option key="female" value="Female">Female</option>
                      <option key="other" value="Other">Other</option>
                    </select>
                  </div>
                  <div className="butdiv">
                    <button className="but2" type="submit">SUBMIT</button>
                  </div>
                </form>
                {responseMessage && <p className="responseMessage">{responseMessage}</p>}
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

import React, { useState } from 'react';
import axios from 'axios';

const ChannelForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        assign: ''
      });

      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value
        });
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/cp`, formData);
            console.log("Data saved:", response.data); 
           
            setFormData({
                name: '',
                assign: ''
            });
        } catch (error) {
            console.error("Error saving data:", error);
        }
    };

  return (
    <div className='main-content'>
        <div className='row'>
        <div className='col-3'></div>
        <div className='col-5'>
            <div className='formback'>
        <h4 className='formhead'>Channel</h4>
        <div className='p-3'>
        <form onSubmit={handleSubmit}>      
        <div className='mt-2'>
        <label> Name</label>
          <input
            type="text"
            name="name"
            className="form-input-field"
            placeholder='Enter Name'
            onChange={handleChange}
            value={formData.name}
            required
          />
        </div>
        <div className='mt-2'>
        <label>Assign</label>
          <input
            type="text"
            name="assign"
            className="form-input-field"           
            placeholder='Assign'
            onChange={handleChange}
            value={formData.assign}
            required
          />
        </div>
        <div className="center">
        <button className="addbutton mt-3" type="submit">SUBMIT</button>
        </div>      
      </form>
    </div>
    </div>
    </div>
    </div>
    </div>
  )
}

export default ChannelForm
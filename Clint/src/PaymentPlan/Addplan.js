import React,{useState} from 'react'
import './Plan.css'

const Addplan = () => {
    const [selectedOption, setSelectedOption] = useState('');

  // Function to handle change in select input
  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };
  return (
    <div className='main-content'>
        <div className='col-6'>
        <h4 className='Headtext'>Add a New Payment Plan</h4>
        <div className='whiteback'>
        <label >Choose an option:</label>
      <select className="select-buttons ps-1" id="selectOption" value={selectedOption} onChange={handleSelectChange}>
        <option value="">Select an option</option>
        <option value="option1">Percentage</option>
        <option value="option2">Amount</option>
      </select>
      {selectedOption && <p>Selected option: {selectedOption}</p>}
      <div className='mt-2'>
          <label className=''>Plan Name</label>
          <input type="text" className="form-input-field " placeholder="Enter Plan Name"   required/>
        </div>
        <div className='mt-2'>
          <label className=''>No of Installment</label>
          <input type="text" className="form-input-field " placeholder=" Plan Name"   required/>
        </div>  
        </div>
        </div>
        </div>
  )
}

export default Addplan
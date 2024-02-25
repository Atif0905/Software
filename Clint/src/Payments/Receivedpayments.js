import React from 'react'

const Receivedpayments = () => {
  return (
    <div className='main-content'>
        <h4 className='Headtext'>Recieve Payment from customer</h4>
        <form>
        <div className='col-4'>
        <div className='whiteback'>
            <label className='mt-3'>Customer ID or Mobile Number</label>
            <input className='form-input-field ' type='text' placeholder='Enter Customer ID or Mobile Number'/>
            <button className='add-buttons mt-3'>Submit</button>
        </div>
        </div>
        </form>
    </div>
  )
}

export default Receivedpayments
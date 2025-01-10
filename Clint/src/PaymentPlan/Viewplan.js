import React, { useEffect, useState } from 'react';
import axios from 'axios';
const Viewplan = () => {
  const [paymentPlans, setPaymentPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  useEffect(() => {
    const fetchPaymentPlans = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/paymentPlans`);
        setPaymentPlans(response.data.paymentPlans);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching payment plans:', error);
        setLoading(false);
      }
    };
    fetchPaymentPlans();
  }, []);
  const handleViewDetails = (plan) => {
    setSelectedPlan(plan);
  };
  return (
    <div className='main-content '>
      <div className='col-4 offset-3 formback' >
        <h4 className='formhead'>Payment Plans</h4>
        <div className='formback'>
              <div className='formtablehead d-flex justify-content-between'>
                <th>Id</th>
                <th>Name</th>
                <th>View Details</th>
                </div>
              {paymentPlans.map((plan, index) => (
                <React.Fragment key={index}>
                  <div className='formtabletext1 d-flex justify-content-between'>
                    <td>{index + 1}</td> 
                    <td>{plan.planName}</td>
                    <td>
                      <a className='view' onClick={() => handleViewDetails(plan)}>View Details</a>
                    </td>
                  </div>
                </React.Fragment>
              ))}
        </div>
      </div>
      <div className=' mt-5'>
  {selectedPlan && (
    <div className='formback '>
    <h4 className='formhead'>Installment Details</h4>
    <div className='formback'>
          <div className='formtablehead d-flex justify-content-between'>
            <th>Installment No:</th>
            <th>Days from booking:</th>
            <th>Percentage:</th>
          </div>
          {selectedPlan.installments.map((installmentObj, index) => (
            <div className='formtabletext1 d-flex justify-content-between' key={index}>
              <td>{installmentObj.installment}</td>
              <td>{installmentObj.daysFromBooking}</td>
              <td>{installmentObj.amountRS}</td>
            </div>
          ))}
    </div>
    </div>
  )}
</div>
    </div>
  );
}
export default Viewplan;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

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
    <div className='main-content'>
      <div className='col-7'>
        <h4 className='Headtext'>Payment Plans</h4>
        <div className='whiteback'>
          <table>
            <thead>
              <tr>
                <th>Id</th>
                <th>Name</th>
                <th>View Details</th>      
              </tr>
            </thead>
            <tbody>
              {paymentPlans.map(plan => (
                <React.Fragment key={plan._id}>
                  <tr>
                    <td>{plan._id}</td>
                    <td>{plan.planName}</td>
                    <td><button onClick={() => handleViewDetails(plan)}>View Details</button></td>
                  </tr>
                  {selectedPlan && selectedPlan._id === plan._id && (
                   <tr>
                   <td colSpan="3">
                     <div>
                       <h4>Installment Details</h4>
                       <ul>
                         {plan.installments.map((installmentObj, index) => (
                          <>
                           <li key={index}>{installmentObj.installment}</li>
                           <li>{installmentObj.daysFromBooking}</li>
                           <li>{installmentObj.amountRS}</li>
                           </>
                         ))}
                       </ul>
                     </div>
                   </td>
                 </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Viewplan;

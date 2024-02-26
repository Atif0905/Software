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
    <div className='main-content d-flex justify-content-between'>
      <div className='col-5'>
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
              {paymentPlans.map((plan, index) => (
                <React.Fragment key={index}>
                  <tr>
                    <td>{index + 1}</td> 
                    <td>{plan.planName}</td>
                    <td>
                      <a className='view' onClick={() => handleViewDetails(plan)}>View Details</a>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className='col-6'>
  {selectedPlan && (
    <div>
    <h4 className='Headtext'>Installment Details</h4>
    <div className='whiteback'>
      <table>
        <thead>
          <tr>
            <th>Installment No:</th>
            <th>Days from booking:</th>
            <th>Amount:</th>
          </tr>
        </thead>
        <tbody>
          {selectedPlan.installments.map((installmentObj, index) => (
            <tr key={index}>
              <td>{installmentObj.installment}</td>
              <td>{installmentObj.daysFromBooking}</td>
              <td>{installmentObj.amountRS}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  )}
</div>

    </div>
  );
}

export default Viewplan;

import React, { useState, useEffect, useMemo } from "react";
import { fetchProjects, fetchCustomers, fetchPaymentDetails } from '../../../services/customerService'; // Import the services
import '../AdminDashboard.css';
import { BsArrowDownRightCircleFill } from "react-icons/bs";
import PasswordPrompt from "../../../Accountscomponent/PasswordPrompt";
import Loader from '../../../Confirmation/Loader'
import Copyright from "../../../Confirmation/Copyright";
const ProjectsUpload = ({ projectsData, customersData, paymentDetailsData }) => {
  const [projects, setProjects] = useState(projectsData || []);
  const [customers, setCustomers] = useState(customersData || []);
  const [paymentDetails, setPaymentDetails] = useState(paymentDetailsData || []);
  const [loading, setLoading] = useState(!projectsData || !customersData || !paymentDetailsData);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState({
    totalPrice: false,
    totalReceivedPayment: false,
    duePayment: false,
  });
  const [isPasswordEntered, setIsPasswordEntered] = useState({});
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(null);

  useEffect(() => {
    if (!projectsData || !customersData || !paymentDetailsData) {
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    try {
      const [projects, customers, paymentDetails] = await Promise.all([
        fetchProjects(),
        fetchCustomers(),
        fetchPaymentDetails(),
      ]);
      setProjects(projects);
      setCustomers(customers);
      setPaymentDetails(paymentDetails);
    } catch (error) {
      setError("Error fetching data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const calculatePerUnitPayment = (rate, plcCharges, idcCharges, plotSize, edcPrice) => {
    return (parseFloat(rate) + parseFloat(plcCharges) + parseFloat(idcCharges) + parseFloat(edcPrice)) * parseFloat(plotSize);
  };

  const calculateTotalPriceOfAllUnits = useMemo(() => {
    return projects.reduce((totalPrice, project) => {
      return totalPrice + project.blocks.reduce((blockTotal, block) => {
        return blockTotal + block.units.reduce((unitTotal, unit) => {
          return unitTotal + calculatePerUnitPayment(unit.rate, unit.plcCharges, unit.idcCharges, unit.plotSize, unit.edcPrice);
        }, 0);
      }, 0);
    }, 0).toFixed(2);
  }, [projects]);

  const calculateTotalAmountReceived = useMemo(() => {
    if (!Array.isArray(paymentDetails) || paymentDetails.length === 0) {
      return '0.00';
    }
    return paymentDetails.reduce((sum, payment) => sum + parseFloat(payment.amount || 0), 0).toFixed(2);
  }, [paymentDetails]);

  const calculateDuePayment = useMemo(() => {
    return (parseFloat(calculateTotalPriceOfAllUnits) - parseFloat(calculateTotalAmountReceived)).toFixed(2);
  }, [calculateTotalPriceOfAllUnits, calculateTotalAmountReceived]);

  const toggleVisibility = (key) => {
    if (!isPasswordEntered[key]) {
      setShowPasswordPrompt(key);
    } else {
      setIsVisible((prevState) => ({ ...prevState, [key]: !prevState[key] }));
    }
  };

  const handlePasswordSubmit = (enteredPassword) => {
    if (enteredPassword === "womeki") { 
      setIsPasswordEntered((prevState) => ({ ...prevState, [showPasswordPrompt]: true }));
      setIsVisible((prevState) => ({ ...prevState, [showPasswordPrompt]: true }));
    } else {
      alert("Incorrect password. Please try again.");
    }
    setShowPasswordPrompt(null);
  };
  return (
    <div className="">
       {loading ? (
        <Loader/>
      ) : (
      <div className="upperconatiner">
      <div className="paymentdiv">
        <h3 className="text-center mt-3">PAYMENT </h3>
        <div className="row">
        <div className="col-1 mt-3">
        <div className="circle"><div className="paymentcircle1"><div className="paymentcircle"></div></div></div>
        <div className="circle"><div className="paymentcircle1"><div className="paymentcircle"></div></div></div>
        <div className="circle"><div className="paymentcircle1"><div className="paymentcircle"></div></div></div>
        </div>
        <div className="col-11">
        <div className="payment-box  totalpaymentdiv">
      <h6 className="paymenttext">Total Payment</h6>
      <p className="colouredtext1" onClick={() => toggleVisibility('totalPrice')}>{isVisible.totalPrice ? calculateTotalPriceOfAllUnits : '***********'}</p>
      <BsArrowDownRightCircleFill className="arrowicon1 arrowicon" onClick={() => toggleVisibility('totalPrice')} />
      </div>
        <div className=" payment-box  receivepaymentdiv">
      <h6 className="paymenttext">Received Payment</h6>
      <p className="colouredtext1" onClick={() => toggleVisibility('totalReceivedPayment')}>{isVisible.totalReceivedPayment ? calculateTotalAmountReceived : '***********'}</p>
      <BsArrowDownRightCircleFill className="arrowicon2 arrowicon" onClick={() => toggleVisibility('totalReceivedPayment')} />
      </div>
      <div className=" payment-box duepaymentdiv">
      <h3 className="paymenttext">Due Payment</h3>
      <p className="colouredtext1" onClick={() => toggleVisibility('duePayment')}>{isVisible.duePayment ? calculateDuePayment : '***********'}</p>
      <BsArrowDownRightCircleFill className="arrowicon3 arrowicon" onClick={() => toggleVisibility('duePayment')} />
      </div>

        </div>
        </div>
      </div>
      <div></div>
      </div>
      )}
      {showPasswordPrompt && (
        <PasswordPrompt
          onSubmit={handlePasswordSubmit}
          onClose={() => setShowPasswordPrompt(null)}
        />
      )}

    </div>
  );
};

export default ProjectsUpload;

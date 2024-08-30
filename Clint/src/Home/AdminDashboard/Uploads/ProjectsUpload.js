import React, { useState, useEffect } from "react";
import axios from "axios";
import '../AdminDashboard.css';
import { FaMoneyCheck } from "react-icons/fa6";
import Loader from "../../../Confirmation/Loader";
import PasswordPrompt from "../../../Accountscomponent/PasswordPrompt";

const ProjectsUpload = () => {
  const [projects, setProjects] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalReceivedPayment, setTotalReceivedPayment] = useState(0);
  const [duePayment, setDuePayment] = useState(0);
  const [paymentDetails, setPaymentDetails] = useState({});
  const [isVisible, setIsVisible] = useState({
    totalPrice: false,
    totalReceivedPayment: false,
    duePayment: false,
    interestAmountPayment: false,
  });
  const [isPasswordEntered, setIsPasswordEntered] = useState({
    totalPrice: false,
    totalReceivedPayment: false,
    duePayment: false,
    interestAmountPayment: false,
  });
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(null);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/getAllProjects`
      );
      const data = response.data;
      if (response.status === 200 && data.status === "ok") {
        const projectsWithUnitCount = await Promise.all(
          data.data.map(async (project) => {
            const blocksWithUnitCount = await Promise.all(
              project.blocks.map(async (block) => {
                const unitCount = await getUnitCount(project._id, block._id);
                return { ...block, unitCount };
              })
            );
            return { ...project, blocks: blocksWithUnitCount };
          })
        );
        setProjects(projectsWithUnitCount);
      } else {
        console.error("Failed to fetch projects:", data.error);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (projects.length > 0) {
      const totalPriceOfAllUnits = calculateTotalPriceOfAllUnits();
      setTotalPrice(totalPriceOfAllUnits);
    }
  }, [projects]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/Viewcustomer`);
        setCustomers(response.data);
        const totalReceived = response.data.reduce((acc, curr) => acc + parseFloat(curr.paymentReceived || 0), 0);
        setTotalReceivedPayment(totalReceived);
      } catch (error) {
        console.error('Error fetching customers:', error);
        setError('Error fetching customers. Please try again later.');
      } finally {
        setLoading(false);
      }
    };  
    fetchCustomers();
  }, []);

  useEffect(() => {
    const due = (parseFloat(totalPrice || 0) - parseFloat(totalReceivedPayment) || 0);
    setDuePayment(due.toFixed(2));
  }, [totalPrice, totalReceivedPayment]);

  const calculatePerUnitPayment = (rate, plcCharges, idcCharges, plotSize, edcPrice) => {
    const total = (parseFloat(rate) + parseFloat(plcCharges) + parseFloat(idcCharges) + parseFloat(edcPrice)) * parseFloat(plotSize);
    return total;
  };

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/paymentDetails`);
        const data = response.data.data; 
        if (response.status === 200) {
          setPaymentDetails(data);
        } else {
          console.error("Failed to fetch payment details.");
        }
      } catch (error) {
        console.error("Error fetching payment details:", error);
      }
    };
    fetchPaymentDetails();
  }, []);

  const calculateTotalAmountReceived = () => {
    if (!Array.isArray(paymentDetails) || paymentDetails.length === 0) {
      return 0;
    }  
    const totalAmountReceived = paymentDetails.reduce((sum, payment) => sum + payment.amount, 0);
    return parseFloat(totalAmountReceived).toFixed(2);
  };

  const calculateTotalPriceOfAllUnits = () => {
    let totalPrice = 0;
    projects.forEach(project => {
      project.blocks.forEach(block => {
        block.units.forEach(unit => {
          totalPrice += calculatePerUnitPayment(unit.rate, unit.plcCharges, unit.idcCharges, unit.plotSize , unit.edcPrice);
        });
      });
    });
    return totalPrice.toFixed(2);
  };

  const getUnitCount = async (projectId, blockId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/getUnitCount/${projectId}/${blockId}`
      );
      const data = response.data;
      if (response.status === 200 && data.status === "ok") {
        return data.unitCount;
      } else {
        console.error("Failed to get unit count:", data.error);
        return 0;
      }
    } catch (error) {
      console.error("Error getting unit count:", error);
      return 0;
    }
  };  

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
    <div className="admin-dashboard">
      {loading ? (
        <Loader />
      ) : (
        <div className="container">
      <div className="flexy">
        <div className="paymentmaindiv">
          <div className="coloureddiv1">
            <h3 className="colouredtext">Total Payment</h3>
            <div className="d-flex justify-content-between">
              <p className="colouredtext1" onClick={() => toggleVisibility('totalPrice')}>
                {isVisible.totalPrice ? totalPrice : '********'}
              </p>
              <h6 className="react-icon-red"><FaMoneyCheck/></h6>
            </div>
          </div>
          <div className="coloureddiv">
            <p className="descriptiondiv"> </p>
          </div>
        </div>
        <div className="paymentmaindiv">
          <div className="coloureddiv1">
            <h3 className="colouredtext">Received Payment</h3>
            <div className="d-flex justify-content-between">
              <p className="colouredtext1" onClick={() => toggleVisibility('totalReceivedPayment')}>
                {isVisible.totalReceivedPayment ? calculateTotalAmountReceived() : '********'}
              </p>
              <h6 className="react-icon-red"><FaMoneyCheck/></h6>
            </div>
          </div>
          <div className="coloureddiv">
            <p className="descriptiondiv"> </p>
          </div>          
        </div>
        <div className="paymentmaindiv">
          <div className="coloureddiv1">
            <h3 className="colouredtext">Due Payment</h3>
            <div className="d-flex justify-content-between">
              <p className="colouredtext1" onClick={() => toggleVisibility('duePayment')}>
                {isVisible.duePayment ? (parseFloat(totalPrice) - parseFloat(calculateTotalAmountReceived())).toFixed(2) : '********'}
              </p>
              <h6 className="react-icon-red"><FaMoneyCheck/></h6>
            </div>
          </div>
          <div className="coloureddiv">
            <p className="descriptiondiv"> </p>
          </div>          
        </div>
        <div className="paymentmaindiv">
          <div className="coloureddiv1">
            <h3 className="colouredtext">Interest Amount Payment</h3>
            <div className="d-flex justify-content-between">
              <p className="colouredtext1" onClick={() => toggleVisibility('interestAmountPayment')}>
                {isVisible.interestAmountPayment ? '0' : '********'}
              </p>
              <h6 className="react-icon-red"><FaMoneyCheck/></h6>
            </div>
          </div>
          <div className="coloureddiv">
            <p className="descriptiondiv"> </p>
          </div>          
        </div>
      </div>
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

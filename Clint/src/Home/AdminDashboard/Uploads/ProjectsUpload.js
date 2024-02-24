import React, { useState, useEffect } from "react";
import axios from "axios";
import '../AdminDashboard.css';
import { FaMoneyCheck } from "react-icons/fa6";
const ProjectsUpload = () => {
  const [projects, setProjects] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalReceivedPayment, setTotalReceivedPayment] = useState(0);
  const [duePayment, setDuePayment] = useState(0);

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
        console.log(response);
        setCustomers(response.data);
        
        // Calculate total received payment
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
    // Calculate due payment
    const due = parseFloat(totalPrice) - parseFloat(totalReceivedPayment);
    setDuePayment(due.toFixed(2));
  }, [totalPrice, totalReceivedPayment]);

  const calculatePerUnitPayment = (rate, plcCharges, idcCharges, plotSize) => {
    const total = (parseFloat(rate) + parseFloat(plcCharges) + parseFloat(idcCharges)) * parseFloat(plotSize);
    return total;
  };

  const calculateTotalPriceOfAllUnits = () => {
    let totalPrice = 0;
    projects.forEach(project => {
      project.blocks.forEach(block => {
        block.units.forEach(unit => {
          totalPrice += calculatePerUnitPayment(unit.rate, unit.plcCharges, unit.idcCharges, unit.plotSize);
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
  
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container">
      <h4>Payment Blocks</h4>
      <div className="  flexy ">
        <div className="paymentmaindiv">
          <div className="coloureddiv1">
            <h3 className="colouredtext">Total Payment</h3>
            <div className="d-flex justify-content-between">
            <p className="colouredtext1">{totalPrice}</p>
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
            <p className="colouredtext1">{totalReceivedPayment}</p>
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
            <p className="colouredtext1">{duePayment}</p>
            <h6 className="react-icon-red"><FaMoneyCheck/></h6>
            </div>
          </div>
          <div className="coloureddiv">
            <p className="descriptiondiv"> </p>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ProjectsUpload;

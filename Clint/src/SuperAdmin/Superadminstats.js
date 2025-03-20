import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../Confirmation/Loader";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./Main.css";

const Superadminstats = () => {
  const [projects, setProjects] = useState([]);
  const [projectUnitCounts, setProjectUnitCounts] = useState({});
  const [paymentDetails, setPaymentDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allProjectsUnits, setAllProjectsUnits] = useState({
    totalUnits: 0,
    totalAvailableUnits: 0,
    totalHoldUnits: 0,
    totalSoldUnits: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [projectsResponse, paymentResponse] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/getAllProjects`),
          axios.get(`${process.env.REACT_APP_API_URL}/paymentDetails`),
        ]);

        // Projects and payment details
        const projectsData = projectsResponse.data.data;
        const paymentsData = paymentResponse.data.data;

        setProjects(projectsData);

        const paymentMap = paymentsData.reduce((acc, payment) => {
          acc[payment.projectId] = (acc[payment.projectId] || 0) + payment.amount;
          return acc;
        }, {});

        setPaymentDetails(paymentMap);

        // Update unit counts for all projects
        const unitCounts = calculateTotalUnits(projectsData);
        setAllProjectsUnits(unitCounts);
        updateProjectUnitCounts(projectsData);

      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateTotalUnits = (projects) => {
    let totalUnits = 0;
    let totalAvailableUnits = 0;
    let totalHoldUnits = 0;
    let totalSoldUnits = 0;
  
    projects.forEach((project) => {
      project.blocks.forEach((block) => {
        block.units.forEach((unit) => {
          totalUnits++;
          if (unit.status === "hold") {
            totalHoldUnits++;
          } else if (unit.status === "sold") {
            totalSoldUnits++;
          } else {
            totalAvailableUnits++;
          }
        });
      });
    });
  
    return {
      totalUnits,
      totalAvailableUnits,
      totalHoldUnits,
      totalSoldUnits,
    };
  };
  

  const updateProjectUnitCounts = (projects) => {
    const counts = {};
    projects.forEach((project) => {
      const { totalUnits, totalAvailableUnits, totalHoldUnits, totalSoldUnits } =
        calculateTotalUnits([project]);
      counts[project._id] = { totalUnits, totalAvailableUnits, totalHoldUnits, totalSoldUnits };
    });
    setProjectUnitCounts(counts);
  };

  const calculateTotalPriceSum = (projectId) => {
    const project = projects.find((project) => project._id === projectId);
    if (!project) return 0;

    return project.blocks.reduce((sum, block) => {
      return (
        sum +
        block.units.reduce((blockSum, unit) => blockSum + parseFloat(unit.totalPrice || 0), 0)
      );
    }, 0);
  };

  const graphData = projects.map((project) => ({
    name: project.name
      .split(" ")
      .map((word) => word[0])
      .join(""),
    fullName: project.name,
    available: projectUnitCounts[project._id]?.totalAvailableUnits || 0,
    hold: projectUnitCounts[project._id]?.totalHoldUnits || 0,
    sold: projectUnitCounts[project._id]?.totalSoldUnits || 0,
    total: calculateTotalPriceSum(project._id),
    received: paymentDetails[project._id] || 0,
    due: calculateTotalPriceSum(project._id) - (paymentDetails[project._id] || 0),
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="custom-tooltip"
          style={{
            backgroundColor: "#fff",
            padding: "10px",
            border: "1px solid #ccc",
          }}
        >
          <p className="label">{`Project Name: ${payload[0].payload.fullName}`}</p>
          <p>{`Available: ${payload[0].payload.available}`}</p>
          <p>{`Hold: ${payload[0].payload.hold}`}</p>
          <p>{`Sold: ${payload[0].payload.sold}`}</p>
        </div>
      );
    }
    return null;
  };

  if (loading) return <Loader />;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="main-content">
      <div className="container">
        <div className="graph-container">
          <ResponsiveContainer width="100%" height={400}>
          <BarChart data={graphData}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="name" />
  <YAxis />
  <Tooltip content={<CustomTooltip />} />
  <Legend />
  <Bar dataKey="available" name="Available Units" fill="#82ca9d" />
  <Bar dataKey="hold" name="Hold Units" fill="#8884d8" />
  <Bar dataKey="sold" name="Sold Units" fill="#D31F3C" />
</BarChart>

          </ResponsiveContainer>
        </div>
        <div className="formback">
          <h4 className="formhead">Summary</h4>
          <div className="summarylist">
            <li>Total Units: {allProjectsUnits.totalUnits}</li>
            
          </div>
          <div className="summarylist">
            <li>Available Units:{allProjectsUnits.totalAvailableUnits} </li>
          </div>
          <div className="summarylist">
            <li>Hold Units: {allProjectsUnits.totalHoldUnits}</li>
            
          </div>
          <div className="summarylist">
            <li>Sold Units: {allProjectsUnits.totalSoldUnits}</li>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Superadminstats;

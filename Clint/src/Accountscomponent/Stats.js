import React, { useState, useEffect, useMemo } from "react";
import { fetchProjects, fetchCustomers, fetchPaymentDetails } from '../services/customerService';
import Loader from "../Confirmation/Loader";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Stats = ({ projectsData, customersData, paymentDetailsData }) => {
  const [projects, setProjects] = useState(projectsData || []);
  const [customers, setCustomers] = useState(customersData || []);
  const [paymentDetails, setPaymentDetails] = useState(paymentDetailsData || []);
  const [loading, setLoading] = useState(!projectsData || !customersData || !paymentDetailsData);
  const [error, setError] = useState(null);

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

  // Prepare data for the chart
  const chartData = [
    { name: 'Total Price', value: parseFloat(calculateTotalPriceOfAllUnits) },
    { name: 'Total Amount Received', value: parseFloat(calculateTotalAmountReceived) },
    { name: 'Due Payment', value: parseFloat(calculateDuePayment) }
  ];

  return (
    <div className="main-content">
      {loading ? (
        <Loader/>
      ) : (
        <div>
            <h3 className="formhead">Stats</h3>
            <div className="p-5">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#ff7927" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stats;

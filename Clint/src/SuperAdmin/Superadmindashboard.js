import React, { useState, useEffect, useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { fetchProjects, fetchCustomers, fetchPaymentDetails } from '../services/customerService';
import Loader from "../Confirmation/Loader";
import { MdAccountBalanceWallet } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { CgNotes } from "react-icons/cg";
import { GoProjectRoadmap } from "react-icons/go";
const Superadmindashboard = ({ projectsData, customersData, paymentDetailsData }) => {
  const [projects, setProjects] = useState(projectsData || []);
  const [paymentDetails, setPaymentDetails] = useState(paymentDetailsData || []);
  const [loading, setLoading] = useState(!projectsData || !paymentDetailsData);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!projectsData || !paymentDetailsData) {
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    try {
      const [projects, paymentDetails] = await Promise.all([
        fetchProjects(),
        fetchPaymentDetails(),
      ]);
      setProjects(projects);
      setPaymentDetails(paymentDetails);
      console.log(projects)
    } catch (error) {
      setError("Error fetching data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  const calculateTotalPriceOfAllUnits = useMemo(() => {
    return projects.reduce((totalPrice, project) => {
      return totalPrice + (project.blocks?.reduce((blockTotal, block) => {
        return blockTotal + (block.units?.reduce((unitTotal, unit) => {
          const unitPrice = parseFloat(unit.totalPrice) || 0;
          return unitTotal + unitPrice;
        }, 0));
      }, 0) || 0);
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
  const paymentDataByDate = useMemo(() => {
    if (!Array.isArray(paymentDetails)) return [];

    const grouped = paymentDetails.reduce((acc, payment) => {
      const date = payment.PaymentDate.split("T")[0]; // Extract date (e.g., "2024-12-21")
      const amount = parseFloat(payment.amount) || 0;

      if (!acc[date]) {
        acc[date] = { date, totalAmount: 0 };
      }
      acc[date].totalAmount += amount;

      return acc;
    }, {});

    return Object.values(grouped).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [paymentDetails]);

  return (
    <div className="newmain-content">
      {loading ? (
        <Loader />
      ) : (
        <div>
          <h3 className="pagehead mt-3">Dashboard</h3>
          <div className="paymentdiv1">
        <div>
        <div className="paymentdiv2">
        <div className="payment-box1 ">
        <div className="d-flex " > <div className="dashboardicondiv"><MdAccountBalanceWallet/> </div><h6 className="paymenttext1"> Total Payment</h6></div>
      <p className="colouredtext" >{ calculateTotalPriceOfAllUnits }</p>
      </div>
        <div className=" payment-box1  ">
      <div className="d-flex"><div className="dashboardicondiv"><FaUsers/> </div><h6 className="paymenttext1">Received Payment</h6></div>
      <p className="colouredtext">{calculateTotalAmountReceived}</p>
      </div>
      <div className=" payment-box1 ">
      <div className="d-flex"><div className="dashboardicondiv"><CgNotes/> </div><h3 className="paymenttext1"> Due Payment</h3></div>
      <p className="colouredtext" >{calculateDuePayment}</p>
      </div>
      <div className=" payment-box1 ">
      <div className="d-flex"><div className="dashboardicondiv"><CgNotes/> </div><h3 className="paymenttext1"> Total Customer</h3></div>
      <p className="colouredtext" >{calculateDuePayment}</p>
      </div>
      </div>
      <div className="">
      <div className=" payment-box1 mt-3">
      <div className="d-flex"><div className="dashboardicondiv"><CgNotes/> </div><h3 className="paymenttext1"> Total projects</h3></div>
      <p className="colouredtext">{calculateDuePayment }</p>
      </div>
      </div>
      </div>
      <div className=" payment-box2 ">
      
      </div>
      </div>
          <div className="paymentdiv1 mt-3">
            <div className="payment-box3">
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={paymentDataByDate}>
              <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(162, 128, 255, 0.32)" stopOpacity={1} />
                    <stop offset="100%" stopColor="rgba(162, 128, 255, 0)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="totalAmount"
                  stroke="#A280FF"
                  fill="url(#colorUv)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
            </div>
            <div className="payment-box2">
            <h3>Our Projects</h3>
            { projects.map((project, Index) =>{
              return(
              <div key={Index}>
                <div className="dashboardprojectsec">
                  <GoProjectRoadmap className="projecticon"/><p className="dashboardprojecttext">{project.name.toUpperCase()}</p>
                </div>
              </div>
              )
            })

            }
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Superadmindashboard;

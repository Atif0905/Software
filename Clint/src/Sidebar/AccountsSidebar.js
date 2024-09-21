import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import './Side.css';
import { FaRegUser } from "react-icons/fa";
import { RiDashboard3Line } from "react-icons/ri";
import ConfirmationModal from '../Confirmation/ConfirmationModal';
import { IoLogOutSharp } from "react-icons/io5";

const AccountsSidebar = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // To get the current path

  const logOut = () => {
    window.localStorage.clear();
    navigate('/sign-in');
  };

  const handleSubmit = () => {
    setShowConfirm(true);
  };

  return (
    <div>
      <div className='newside'>
        <div>
          <img src='./WTSlogo.png' className='sidelogo' alt='' />
        </div>
        <div>
          <Link to="/AccountsDashBoard">
            <div className={`Sidelink ${location.pathname === '/AccountsDashBoard' ? 'active' : ''}`}>
              <RiDashboard3Line className='svg-icon' />DashBoard
            </div>
          </Link>
          <Link to="/PaymentPerUnit">
            <div className={`Sidelink ${location.pathname === '/PaymentPerUnit' ? 'active' : ''}`}>
              <FaRegUser className='svg-icon' />Payment Per Unit
            </div>
          </Link>
          <Link to="/Stats">
            <div className={`Sidelink ${location.pathname === '/Stats' ? 'active' : ''}`}>
              <FaRegUser className='svg-icon' />Stats
            </div>
          </Link>
          <Link to="/ExpenseForm">
            <div className={`Sidelink ${location.pathname === '/ExpenseForm' ? 'active' : ''}`}>
              <FaRegUser className='svg-icon' />Expenses
            </div>
          </Link>
          <Link to="/Expensedetails">
            <div className={`Sidelink ${location.pathname === '/Expensedetails' ? 'active' : ''}`}>
              <FaRegUser className='svg-icon' />Paid Expenses
            </div>
          </Link>
        </div>
      </div>

      <div className='center1'>
        <div className='sabove'>
          <div>
            <img src='./userface.png' className='userface' alt='' />
          </div>
          <div>
            <IoLogOutSharp onClick={handleSubmit} />
            <ConfirmationModal
              show={showConfirm}
              onClose={() => setShowConfirm(false)}
              onConfirm={() => { setShowConfirm(false); logOut(); }}
              message="Are you sure you want to Logout?"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountsSidebar;

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from "react-router-dom";
import './Side.css';
import { FaRegBell, FaBell } from "react-icons/fa";
import { TfiUser } from "react-icons/tfi";
import ConfirmationModal from '../Confirmation/ConfirmationModal';
import { IoLogOutSharp } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import { MdOutlinePayments } from "react-icons/md";
import { RiDashboard3Line } from "react-icons/ri";
import useFetchUser from '../hooks/useFetchUser';
const SubAdmin = () => {
    const [activeDropdown, setActiveDropdown] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [bellClicked, setBellClicked] = useState(false);
  const dropdownRef = useRef(null);
  const { subAdmin, loading: userLoading } = useFetchUser();
  const handleDropdownToggle = (dropdownId) => {
    setActiveDropdown(activeDropdown === dropdownId ? null : dropdownId);
  };
  const isDropdownActive = (routes) => {
    return routes.some((route) => location.pathname.includes(route));
  };
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
          <Link to="/Sub-Admin-Dashboard">
            <div className={`Sidelink ${location.pathname === '/Sub-Admin-Dashboard' ? 'active' : ''}`}>
              <RiDashboard3Line className='svg-icon' /> DashBoard
            </div>
          </Link>
          {/* <div className="dropdown">
            <div
              className="dropdown-toggle"
              onClick={() => handleDropdownToggle('projectMaster')}
            >
              <AiOutlineFundProjectionScreen className='svg-icon' /> Project Master <IoIosArrowDown />
            </div>
            <div
              className={`dropdown-menu ${
                activeDropdown === 'projectMaster' || isDropdownActive(['/Projects', '/Addblock', '/Addunit']) ? 'active' : ''
              }`}
            >
              <Link to='/Projects'>
                <li className={`dropdown-item ${location.pathname === '/Projects' ? 'active' : ''}`}>Upload Project</li>
              </Link>
              <Link to='/Addblock'>
                <li className={`dropdown-item ${location.pathname === '/Addblock' ? 'active' : ''}`}>Add Block</li>
              </Link>
              <Link to='/Addunit'>
                <li className={`dropdown-item ${location.pathname === '/Addunit' ? 'active' : ''}`}>Add Unit</li>
              </Link>
            </div>
          </div>
          <div className="dropdown">
            <div
              className="dropdown-toggle"
              onClick={() => handleDropdownToggle('paymentPlan')}
            >
              <RiSecurePaymentLine className='svg-icon' /> Payment Plan <IoIosArrowDown />
            </div>
            <div
              className={`dropdown-menu ${
                activeDropdown === 'paymentPlan' || isDropdownActive(['/Addplan', '/ViewPlan']) ? 'active' : ''
              }`}
            >
              <Link to='/Addplan'>
                <li className={`dropdown-item ${location.pathname === '/Addplan' ? 'active' : ''}`}>Add Plan</li>
              </Link>
              <Link to='/ViewPlan'>
                <li className={`dropdown-item ${location.pathname === '/ViewPlan' ? 'active' : ''}`}>View Plan</li>
              </Link>
            </div>
          </div> */}
          <div className="dropdown">
            <div
              className="dropdown-toggle"
              onClick={() => handleDropdownToggle('customer')}
            >
              <TfiUser className='svg-icon' /> Customer <IoIosArrowDown />
            </div>
            <div
              className={`dropdown-menu ${
                activeDropdown === 'customer' || isDropdownActive(['/Sub-Admin-Add-customer', '/Sub-Admin-View-customer']) ? 'active' : ''
              }`}
            >
              <Link to='/Sub-Admin-Add-customer'>
                <li className={`dropdown-item ${location.pathname === '/Sub-Admin-Add-customer' ? 'active' : ''}`}>Add Customer</li>
              </Link>
              <Link to='/Sub-Admin-View-customer'>
                <li className={`dropdown-item ${location.pathname === '/Sub-Admin-View-customer' ? 'active' : ''}`}>View Customer</li>
              </Link>
            </div>
          </div>
          <Link to="/Sub-Admin-Receive-customer">
            <div className={`Sidelink ${location.pathname === '/Sub-Admin-Receive-customer' ? 'active' : ''}`}>
              <MdOutlinePayments className='svg-icon' /> Receive Payments
            </div>
          </Link>
          {/* <div className="dropdown">
            <div
              className="dropdown-toggle"
              onClick={() => handleDropdownToggle('Payments')}
            >
              <MdOutlinePayments className='svg-icon' /> Payment <IoIosArrowDown />
            </div>
            <div
              className={`dropdown-menu ${
                activeDropdown === 'Payments' || isDropdownActive(['/ReceivedPayments', '/PayInterestAmount']) ? 'active' : ''
              }`}
            >
              <Link to='/ReceivedPayments'>
                <li className={`dropdown-item ${location.pathname === '/ReceivedPayments' ? 'active' : ''}`}>Received Payment</li>
              </Link>
              <Link to='/PayInterestAmount'>
                <li className={`dropdown-item ${location.pathname === '/PayInterestAmount' ? 'active' : ''}`}>Pay Interest Amount</li>
              </Link>
            </div>
          </div> */}
        </div>
      </div>

      <div className='center1'>
        <div className='sabove'>
          <div className='d-flex'>
            <img src='./userface.png' className='userface' alt='' />
            {subAdmin && (
              <div>
                <p className='loginname'>{subAdmin.fname} {subAdmin.lname}</p>
              </div>
            )}
          </div>
          <div>
            <IoLogOutSharp className='logout' onClick={handleSubmit} />
            <ConfirmationModal
              show={showConfirm}
              onClose={() => setShowConfirm(false)}
              onConfirm={() => {
                setShowConfirm(false);
                logOut();
              }}
              message="Are you sure you want to Logout?"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default SubAdmin

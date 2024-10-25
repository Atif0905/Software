import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from "react-router-dom";
import './Side.css';
import { FaRegUser, FaRegBell, FaBell } from "react-icons/fa";
import { RiSecurePaymentLine } from "react-icons/ri";
import { TfiUser } from "react-icons/tfi";
import ConfirmationModal from '../Confirmation/ConfirmationModal';
import { IoLogOutSharp } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import { AiOutlineFundProjectionScreen } from "react-icons/ai";
import { RiDashboard3Line } from "react-icons/ri";
import { MdOutlinePayments } from "react-icons/md";
import DueDateModal from '../Reminder/DueDateModal';
import useFetchUser from '../hooks/useFetchUser';
import { BsInfoSquare } from "react-icons/bs";
const Sidebar = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [bellClicked, setBellClicked] = useState(false);
  const dropdownRef = useRef(null);
  const bellIconRef = useRef(null);  // New reference for the bell icon
  const { user , loading: userLoading } = useFetchUser();
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

  const toggleBellIcon = () => {
    setBellClicked(!bellClicked);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        bellIconRef.current &&
        !bellIconRef.current.contains(event.target)
      ) {
        setBellClicked(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      <div className='newside'>
      <div>
          <img src='./WTSlogo.png' className='sidelogo' alt='' />
        </div>
        <div>
          <Link to="/AdminDashboard">
            <div className={`Sidelink ${location.pathname === '/AdminDashboard' ? 'active' : ''}`}>
              <RiDashboard3Line className='svg-icon' /> DashBoard
            </div>
          </Link>

          <Link to="/Adminuser">
            <div className={`Sidelink ${location.pathname === '/Adminuser' ? 'active' : ''}`}>
              <FaRegUser className='svg-icon' /> User
            </div>
          </Link>

          <div className="dropdown">
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
          </div>

          <div className="dropdown">
            <div
              className="dropdown-toggle"
              onClick={() => handleDropdownToggle('customer')}
            >
              <TfiUser className='svg-icon' /> Customer <IoIosArrowDown />
            </div>
            <div
              className={`dropdown-menu ${
                activeDropdown === 'customer' || isDropdownActive(['/Addcustomer', '/ViewCustomer']) ? 'active' : ''
              }`}
            >
              <Link to='/Addcustomer'>
                <li className={`dropdown-item ${location.pathname === '/Addcustomer' ? 'active' : ''}`}>Add Customer</li>
              </Link>
              <Link to='/ViewCustomer'>
                <li className={`dropdown-item ${location.pathname === '/ViewCustomer' ? 'active' : ''}`}>View Customer</li>
              </Link>
            </div>
          </div>

          <div className="dropdown">
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
          </div>
          <div className="dropdown">
            <div
              className="dropdown-toggle"
              onClick={() => handleDropdownToggle('Ass')}
            >
              <MdOutlinePayments className='svg-icon' /> ASSG <IoIosArrowDown />
            </div>
            <div
              className={`dropdown-menu ${
                activeDropdown === 'Ass' || isDropdownActive(['/Register-User-Admin', '/AssgProject']) ? 'active' : ''
              }`}
            >
              <Link to='/Register-User-Admin'>
                <li className={`dropdown-item ${location.pathname === '/Register-User-Admin' ? 'active' : ''}`}>Add User</li>
              </Link>
              <Link to='/AssgProject'>
                <li className={`dropdown-item ${location.pathname === '/AssgProject' ? 'active' : ''}`}>Assg project </li>
              </Link>
            </div>
          </div>
          <Link to="/Info">
            <div className={`Sidelink ${location.pathname === '/Info' ? 'active' : ''}`}>
              <BsInfoSquare  className='svg-icon' /> Info
            </div>
          </Link>
        </div>
      </div>

      <div className='center1'>
        <div className='sabove'>
          <div className='d-flex'>
            <img src='./userface.png' className='userface' alt='' />
            {user && (
              <div>
                <p className='loginname'>{user.fname} {user.lname}</p>
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
          
          <div
            className='bellicondiv'
            onClick={toggleBellIcon}
            ref={bellIconRef}  // Reference for the bell icon
          >
            {bellClicked ? <FaBell className='bellicon' /> : <FaRegBell className='bellicon' />}
          </div>

          {bellClicked && (
            <div className={`duedate-dropdown roll-in`} ref={dropdownRef}>
              <DueDateModal />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

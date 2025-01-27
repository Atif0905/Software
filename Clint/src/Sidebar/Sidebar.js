import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from "react-router-dom";
import './Side.css';
import { PiBellBold , PiBellFill} from "react-icons/pi";

import { RiSecurePaymentLine } from "react-icons/ri";
import { TfiUser } from "react-icons/tfi";
import ConfirmationModal from '../Confirmation/ConfirmationModal';
import { FaHistory } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { AiOutlineFundProjectionScreen } from "react-icons/ai";
import { RiDashboard3Line } from "react-icons/ri";
import { MdOutlinePayments } from "react-icons/md";
import DueDateModal from '../Reminder/DueDateModal';
import useFetchUser from '../hooks/useFetchUser';
import axios from 'axios';
import { IoSearch } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import Request from '../Reminder/Request';
import Bell from './Bell';
const Sidebar = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [logoFiles, setLogoFiles] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [bellClicked, setBellClicked] = useState(false);
  const dropdownRef = useRef(null);
  const bellIconRef = useRef(null);
  const { user, loading: userLoading } = useFetchUser();

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

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/logo`);
        if (response.data && response.data.files && response.data.files.length > 0) {
          setLogoFiles(response.data.files);
        } else {
          setLogoFiles([]); // Set to an empty array if response.data is null or no files exist
        }
      } catch (error) {
        // console.error('Error fetching logo:', error);
        setLogoFiles([]); // Set to an empty array on error
      }
    };
    fetchLogo();
  }, []);

  return (
    <div>
      <div className='side'>
        <div className='center mt-3'>
        <img src={logoFiles.length > 0 ? `${process.env.REACT_APP_API_URL}/${logoFiles[0]}` : './Defaultlogo.jpg'} className='sidelogo' alt='Logo' />
        </div>
        <div className='mt-3'>
          <Link to="/AdminDashboard">
            <div className={`Sidelink ${location.pathname === '/AdminDashboard' ? 'active' : ''}`}>
              <RiDashboard3Line className='svg-icon' /> DashBoard
            </div>
          </Link>

          <div className="dropdown">
            <div
              className="dropdown-toggle"
              onClick={() => handleDropdownToggle('projectMaster')}
            >
              <AiOutlineFundProjectionScreen className='svg-icon' /> Project Master <IoIosArrowDown />
            </div>
            {/* AllProjects */}
            <div
              className={`dropdown-menu ${
                activeDropdown === 'projectMaster' || isDropdownActive(['/Projects', '/Addblock', '/Addunit']) ? 'active' : ''
              }`}
            >
              <Link to='/AllProjects'>
                <li className={`dropdown-item ${location.pathname === '/AllProjects' ? 'active' : ''}`}>View All Projects</li>
              </Link>
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
                <li className={`dropdown-item ${location.pathname === '/Register-User-Admin' ? 'active' : ''}`}>Assign Project</li>
              </Link>
            </div>
          </div>
          <Link to="/Admin-Hold-History">
            <div className={`Sidelink ${location.pathname === '/Admin-Hold-History' ? 'active' : ''}`}>
              <FaHistory  className='svg-icon' /> Hold History
            </div>
          </Link>
        </div>
      </div>
      <div className='center1'>
        <div className='sideabove'>
        <div className='relative'><IoSearch className='searchicon'/><input type='search' className='navsearch' placeholder='Search Product'/></div>  
        <div className='right1'>    
        <div className='bellicondiv1' onClick={toggleBellIcon} ref={bellIconRef} >
         {bellClicked ? <PiBellFill className='bellicon' /> : <PiBellBold className='bellicon' />}
        </div>
         {bellClicked && (<div className={`duedate-dropdown roll-in`} ref={dropdownRef}><Bell/></div> )}
           <div className='d-flex'>
            <FaUserCircle className='userface'/>
            {user && (
              <div>  <div className='loginname1'>{user.fname} {user.lname}</div></div>
            )}
          </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Sidebar;

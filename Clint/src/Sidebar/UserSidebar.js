import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from "react-router-dom";
import './Side.css';
import { PiBellBold , PiBellFill} from "react-icons/pi";
import { RiDashboard3Line } from "react-icons/ri";
import useFetchUser from '../hooks/useFetchUser';
import axios from 'axios';
import { IoSearch } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import UserNotification from '../Reminder/UserNotification';
import { FaHistory } from "react-icons/fa";

const UserSidebar = () => {
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
        <a href='/Admin_details'>
  <img 
    src={logoFiles.length > 0 ? `${process.env.REACT_APP_API_URL}/${logoFiles[0]}` : './Defaultlogo.jpg'} 
    className='sidelogo' 
    alt='Logo' 
  />
</a>

        </div>
        <div className='mt-3'>
          <Link to="/UserDashboard">
            <div className={`Sidelink ${location.pathname === '/UserDashboard' ? 'active' : ''}`}>
              <RiDashboard3Line className='svg-icon' /> DashBoard
            </div>
          </Link>
          <Link to="/Hold-History">
            <div className={`Sidelink ${location.pathname === '/Hold-History' ? 'active' : ''}`}>
              <FaHistory className='svg-icon' /> Hold History
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
         {bellClicked && (<div className={`duedate-dropdown roll-in`} ref={dropdownRef}><UserNotification/></div> )}
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

export default UserSidebar;

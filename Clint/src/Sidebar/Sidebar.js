import React, { useState } from "react";
import { Link } from 'react-router-dom';
import './Sidebar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faUser, faClipboard  } from '@fortawesome/free-regular-svg-icons';
import { faRightFromBracket, faChalkboardUser, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  const logOut = () => {
    const isConfirmed = window.confirm("Are you sure you want to log out?");
    if (isConfirmed) {
      window.localStorage.clear();
      navigate("/sign-in");
    }
  };

  const [isOpen, setIsOpen] = useState(false);

  const handleOpenSidebar = () => {
    setIsOpen(true);
  };

  const handleCloseSidebar = () => {
    setIsOpen(false);
  };


  return (
    <nav>
    <div className="wrapper">
    <label htmlFor="menu-btn" className="btn menu-btn" onClick={handleOpenSidebar}>
    <FontAwesomeIcon className="bars-img" icon={faBars} />
  </label>
  <div className={`menu-bar ${isOpen ? 'open' : ''}`}>
    <input type="radio" name="slider" id="menu-btn" checked={isOpen} onChange={() => setIsOpen(!isOpen)}/>
          <input type="radio" name="slider" id="close-btn"  />
      <ul className="sidebar">
          <label htmlFor="close-btn" className="btn close-btn" onClick={handleCloseSidebar}>
              <FontAwesomeIcon className="cross-icon" icon={faTimes} />
            </label>
        <img src='./grouplogo.png' className='logoo' alt=''/>
        <div className='mt-2'>
          <li className='Links'><Link to="/" onClick={handleCloseSidebar}><FontAwesomeIcon icon={faChalkboardUser} className='mar'/>Dashboard</Link></li>
          {/* <li className='Links'><Link to="/Projects"><FontAwesomeIcon icon={faListCheck} className='mar' />Projects</Link></li> */}
          {/* <li className='Links'><Link to="/reports"><FontAwesomeIcon icon={faClipboard} className='mar' />Reports</Link></li> */}
          {/* <li className='Links'><Link to="/user"><FontAwesomeIcon icon={faUser} className='mar'/>User</Link></li> */}
          <li className='Links' onClick={logOut}><Link onClick={handleCloseSidebar} ><FontAwesomeIcon icon={faRightFromBracket} className='mar'/>Logout</Link></li>
        </div>
      </ul>
    </div>
    </div>
    </nav>
  );
};

export default Sidebar;

import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUser, faClipboard  } from '@fortawesome/free-regular-svg-icons';
import { faRightFromBracket,  faListCheck, faChalkboardUser } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom"; // Import useNavigate hook

const Sidebar = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook

  const logOut = () => {
    window.localStorage.clear();
    navigate("/sign-in"); // Navigate to the userDetails route
  };

  return (
    <div>
      <ul className="sidebar">
        <img src='./grouplogo.png' className='logoo' alt=''/>
        <div className='mt-2'>
          <li className='Links'><Link to="/"><FontAwesomeIcon icon={faChalkboardUser} className='mar'/>Dashboard</Link></li>
          <li className='Links'><Link to="/Projects"><FontAwesomeIcon icon={faListCheck} className='mar' />Projects</Link></li>
          <li className='Links'><Link to="/reports"><FontAwesomeIcon icon={faClipboard} className='mar' />Reports</Link></li>
          <li className='Links'><Link to="/notifications"><FontAwesomeIcon icon={faBell} className='mar'/>Notifications</Link></li>
          <li className='Links'><Link to="/user"><FontAwesomeIcon icon={faUser} className='mar'/>User</Link></li>
          <li className='Links' onClick={logOut}><Link to="/logout"><FontAwesomeIcon icon={faRightFromBracket} className='mar'/>Logout</Link></li>
        </div>
      </ul>
    </div>
  );
};

export default Sidebar;

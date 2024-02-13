import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faUser, faClipboard } from '@fortawesome/free-regular-svg-icons';
import { faRightFromBracket, faListCheck ,faChalkboardUser } from '@fortawesome/free-solid-svg-icons';
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

  return (
    <div>
      <ul className="sidebar">
        <img src='./grouplogo.png' className='logoo' alt=''/>
        <div className='mt-2'>
          <li className='Links'><Link to="/"><FontAwesomeIcon icon={faChalkboardUser} className='mar'/>Dashboard</Link></li>
          <li className='Links'><Link to="/Projects"><FontAwesomeIcon icon={faListCheck} className='mar' />Projects</Link></li>
          <li className='Links'><Link to="/reports"><FontAwesomeIcon icon={faClipboard} className='mar' />Reports</Link></li>
          <li className='Links'><Link to="/Adminuser"><FontAwesomeIcon icon={faUser} className='mar'/>User</Link></li>
          <li className='Links' onClick={logOut}><Link ><FontAwesomeIcon icon={faRightFromBracket} className='mar'/>Logout</Link></li>
        </div>
      </ul>
    </div>
  );
};

export default Sidebar;

import React from 'react'

import { Link } from 'react-router-dom';
import './Sidebar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUser, faClipboard  } from '@fortawesome/free-regular-svg-icons';
import { faRightFromBracket,  faChalkboardUser } from '@fortawesome/free-solid-svg-icons';
const UserSidebar = () => {
  const logOut = () => {
    window.localStorage.clear();
    window.location.href = "./sign-in";
  };
  return (
    <div>
      <ul className="sidebar">
        <img src='./grouplogo.png' className='logoo' alt=''/>
      <div className='mt-2'>
      <li className='Links'><Link to="/"><FontAwesomeIcon icon={faChalkboardUser} className='mar'/>Dashboard</Link></li>
        <li className='Links'><Link to="/Users-Reports"><FontAwesomeIcon icon={faClipboard} className='mar' />Reports</Link></li>
        {/* <li className='Links'><Link to="/notifications"><FontAwesomeIcon icon={faBell} className='mar'/>Notifications</Link></li> */}
        <li className='Links'><Link to="/user"><FontAwesomeIcon icon={faUser} className='mar'/>User</Link></li>
        <li className='Links' onClick={logOut}><Link to="/logout"><FontAwesomeIcon icon={faRightFromBracket} className='mar'/>Logout</Link></li>
        </div>
      </ul>
    </div>
  )
}

export default UserSidebar
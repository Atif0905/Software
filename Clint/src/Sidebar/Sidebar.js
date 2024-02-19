import React,{useState} from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faUser} from '@fortawesome/free-regular-svg-icons';
import { faRightFromBracket, faChalkboardUser, faListCheck, faPerson  } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  // Function to toggle the visibility of the dropdown menu
  const toggleDropdown = () => {
    setIsOpen(!isOpen); // Toggle the state
  };

  const logOut = () => {
    const isConfirmed = window.confirm("Are you sure you want to log out?");
    if (isConfirmed) {
      window.localStorage.clear();
      navigate("/sign-in");
    }
  };
  const closeDropdown = () => {
    setIsOpen(false); // Close the dropdown
  };
  return (
    <div>
      <ul className="sidebar">
        <h1 className='sidehead'>WIC</h1>
        <div className='mt-5'>
          <li className='Links'><Link to="/"><FontAwesomeIcon icon={faChalkboardUser} className='mar'/><span className='dis'>Dashboard</span></Link></li>
          <div className="dropdown">
            <li className="links dropdown-toggle" onClick={toggleDropdown}><FontAwesomeIcon icon={faListCheck} className='mar'/><span className='dis'>Project Master</span></li>
            <div className={"dropdown-menu" + (isOpen ? " active" : "")} aria-labelledby="dropdownMenuButton">
              <li className="dropdown-item" onClick={closeDropdown}><Link to='/Projects'>Upload Project</Link></li>
              <li className="dropdown-item" onClick={closeDropdown}><Link to='/Addblock'>Add block</Link></li>
              <li className="dropdown-item" onClick={closeDropdown}><Link to='/Addunit'>Add Unit</Link></li>
            </div>
          </div>
          {/* <li className='Links'><Link to="/reports"><FontAwesomeIcon icon={faClipboard} className='mar' />Reports</Link></li> */}
          <li className='Links'><Link to='/Addcustomer'><FontAwesomeIcon icon={faPerson} className='mar'/><span className='dis'>Customer</span></Link></li>
          <li className='Links'><Link to="/Adminuser"><FontAwesomeIcon icon={faUser} className='mar'/><span className='dis'>User</span></Link></li>
          <li className='Links' onClick={logOut}><Link ><FontAwesomeIcon icon={faRightFromBracket} className='mar'/><span className='dis'>Logout</span></Link></li>
        </div>
      </ul>
    </div>
  );
};

export default Sidebar;

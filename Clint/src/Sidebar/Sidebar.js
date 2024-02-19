import React,{useState} from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faUser} from '@fortawesome/free-regular-svg-icons';
import { faRightFromBracket, faChalkboardUser, faListCheck, faPerson  } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isopen1, setIsopen1] = useState(false);
  const navigate = useNavigate();
  const toggleDropdown = () => {
    setIsOpen(!isOpen); 
    setIsopen1(false);
  };
  const toggleDropdown1 = () => {
    setIsopen1(!isopen1);
    setIsOpen(false); 
  };
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
        <h1 className='sidehead'>WIC</h1>
        <div className='mt-5'>
          <li className='Links'><Link to="/"><FontAwesomeIcon icon={faChalkboardUser} className='mar'/>Dashboard</Link></li>
          <div className="dropdown">
      <li className="dropdown-toggle" onClick={toggleDropdown}> <FontAwesomeIcon icon={faListCheck} className='mar'/>Project Master</li>
      <div className={"dropdown-menu" + (isOpen ? " active" : "")} aria-labelledby="dropdownMenuButton">
        <li className=" dropdown-item"><Link to='/Projects'> Upload Project</Link></li>
        <li className=" dropdown-item"><Link to='/Addblock'>Add block</Link></li>
        <li className=" dropdown-item"><Link to='/Addunit'>Add Unit</Link></li>
      </div>
    </div>
    <div className="dropdown">
      <li className="dropdown-toggle" onClick={toggleDropdown1}> <FontAwesomeIcon icon={faListCheck} className='mar'/>Customer Master</li>
      <div className={"dropdown-menu" + (isopen1 ? " active" : "")} aria-labelledby="dropdownMenuButton">
        <li className=" dropdown-item"><Link to='/Addcustomer'><FontAwesomeIcon icon={faPerson} className='mar'/>Add Customer</Link></li>
        <li className=" dropdown-item"><Link to='/ViewCustomer'><FontAwesomeIcon icon={faPerson} className='mar'/> View Customer</Link></li>
      </div>
    </div>
          {/* <li className='Links'><Link to="/reports"><FontAwesomeIcon icon={faClipboard} className='mar' />Reports</Link></li> */}
          <li className='Links'><Link to="/Adminuser"><FontAwesomeIcon icon={faUser} className='mar'/>User</Link></li>
          <li className='Links' onClick={logOut}><Link ><FontAwesomeIcon icon={faRightFromBracket} className='mar'/>Logout</Link></li>
        </div>
      </ul>
    </div>
  );
};

export default Sidebar;

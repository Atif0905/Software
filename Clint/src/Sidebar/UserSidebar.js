import React from 'react'
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import './Sidebar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket,  faChalkboardUser } from '@fortawesome/free-solid-svg-icons';
const UserSidebar = () => {
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
      <div className='nav1'> </div>
      <ul className="sidebar ">
      <div className='nav d-flex justify-content-center'>
      <h1 className='sidehead'>WIC</h1>
      </div>
      <div className=''>
      <li className='Links'><Link to="/"><FontAwesomeIcon icon={faChalkboardUser} className='mar'/>Dashboard</Link></li>
        <li className='Links' onClick={logOut}><Link to="/logout"><FontAwesomeIcon icon={faRightFromBracket} className='mar'/>Logout</Link></li>
        </div>
      </ul>
    </div>
  )
}
export default UserSidebar
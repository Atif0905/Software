import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div>
      <ul className="sidebar">
        <img src='./grouplogo.png' className='logoo' alt=''/>
      <li className='Links'><Link to="/">Dashboard</Link></li>
      <li className='Links'><Link to="/Projects">Projects</Link></li>
        <li className='Links'><Link to="/reports">Reports</Link></li>
        <li className='Links'><Link to="/notifications">Notifications</Link></li>
        <li className='Links'><Link to="/user">User</Link></li>
        <li className='Links'><Link to="/logout">Logout</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;

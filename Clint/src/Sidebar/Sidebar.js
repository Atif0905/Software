import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Sidebar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListCheck, faPerson } from '@fortawesome/free-solid-svg-icons';
import { MdOutlineCircle, MdLogout } from 'react-icons/md';
import { PiFolders } from 'react-icons/pi';
import { IoIosDesktop } from 'react-icons/io';
import { AiOutlineDashboard } from 'react-icons/ai';
import { FaPenToSquare } from 'react-icons/fa6';
import ConfirmationModal from '../Confirmation/ConfirmationModal';

const Sidebar = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const handleDropdownToggle = (dropdownId) => {
    setActiveDropdown(activeDropdown === dropdownId ? null : dropdownId);
  };

  const logOut = () => {
    window.localStorage.clear();
    navigate('/sign-in');
  };

  const handleSubmit = () => {
    setShowConfirm(true);
  };

  return (
    <div>
      <div className='nav1'>
        <h1 className='sidehead'>WIC</h1>
      </div>
      <ul className="sidebar">
        <div className='mt-5'>
          <li className='Links'>
            <Link to="/AdminDashboard">
              <AiOutlineDashboard /> Dashboard
            </Link>
          </li>
          <li className='Links'>
            <Link to="/Adminuser">
              <AiOutlineDashboard /> User
            </Link>
          </li>
          <div className="dropdown">
            <li className="dropdown-toggle" onClick={() => handleDropdownToggle('projectMaster')}>
              <PiFolders /> Project Master
            </li>
            <div className={`dropdown-menu ${activeDropdown === 'projectMaster' ? 'active' : ''}`} aria-labelledby="dropdownMenuButton">
              <li className="dropdown-item">
                <Link to='/Projects'><MdOutlineCircle /> Upload Project</Link>
              </li>
              <li className="dropdown-item">
                <Link to='/Addblock'><MdOutlineCircle /> Add Block</Link>
              </li>
              <li className="dropdown-item">
                <Link to='/Addunit'><MdOutlineCircle /> Add Unit</Link>
              </li>
            </div>
          </div>
          <div className="dropdown">
            <li className="dropdown-toggle" onClick={() => handleDropdownToggle('paymentPlan')}>
              <FontAwesomeIcon icon={faListCheck} className='mar' /> Payment Plan
            </li>
            <div className={`dropdown-menu ${activeDropdown === 'paymentPlan' ? 'active' : ''}`} aria-labelledby="dropdownMenuButton">
              <li className="dropdown-item">
                <Link to='/Addplan'><MdOutlineCircle /> Add Plan</Link>
              </li>
              <li className="dropdown-item">
                <Link to='/ViewPlan'><MdOutlineCircle /> View Plan</Link>
              </li>
            </div>
          </div>
          <div className="dropdown">
            <li className="dropdown-toggle" onClick={() => handleDropdownToggle('customer')}>
              <IoIosDesktop /> Customer
            </li>
            <div className={`dropdown-menu ${activeDropdown === 'customer' ? 'active' : ''}`} aria-labelledby="dropdownMenuButton">
              <li className="dropdown-item">
                <Link to='/Addcustomer'>
                  <FontAwesomeIcon icon={faPerson} className='mar' /><MdOutlineCircle /> Add Customer
                </Link>
              </li>
              <li className="dropdown-item">
                <Link to='/ViewCustomer'>
                  <FontAwesomeIcon icon={faPerson} className='mar' /><MdOutlineCircle /> View Customer
                </Link>
              </li>
            </div>
          </div>
          <div className="dropdown">
            <li className="dropdown-toggle" onClick={() => handleDropdownToggle('payments')}>
              <FaPenToSquare /> Payments
            </li>
            <div className={`dropdown-menu ${activeDropdown === 'payments' ? 'active' : ''}`} aria-labelledby="dropdownMenuButton">
              <li className="dropdown-item">
                <Link to='/ReceivedPayments'><MdOutlineCircle /> Receive Payment</Link>
              </li>
              <li className="dropdown-item">
                <Link to='/PayInterestAmount'><MdOutlineCircle /> Pay Interest Amount</Link>
              </li>
            </div>
          </div>
          <li className='Links' onClick={handleSubmit}>
            <Link>
              <MdLogout /> Logout
            </Link>
          </li>
          <ConfirmationModal
            show={showConfirm}
            onClose={() => setShowConfirm(false)}
            onConfirm={() => { setShowConfirm(false); logOut(); }}
            message="Are you sure you want to Logout?"
          />
        </div>
      </ul>
    </div>
  );
};

export default Sidebar;

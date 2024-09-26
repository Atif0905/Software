// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import './Sidebar.css';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faListCheck, faPerson } from '@fortawesome/free-solid-svg-icons';
// import { MdOutlineCircle, MdLogout } from 'react-icons/md';
// import { PiFolders } from 'react-icons/pi';
// import { IoIosDesktop } from 'react-icons/io';
// import { AiOutlineDashboard } from 'react-icons/ai';
// import { FaPenToSquare } from 'react-icons/fa6';
// import ConfirmationModal from '../Confirmation/ConfirmationModal';

// const Sidebar = () => {
//   const [activeDropdown, setActiveDropdown] = useState(null);
//   const [showConfirm, setShowConfirm] = useState(false);
//   const navigate = useNavigate();

//   const handleDropdownToggle = (dropdownId) => {
//     setActiveDropdown(activeDropdown === dropdownId ? null : dropdownId);
//   };

//   const logOut = () => {
//     window.localStorage.clear();
//     navigate('/sign-in');
//   };

//   const handleSubmit = () => {
//     setShowConfirm(true);
//   };

//   return (
//     <div>
//       <div className='nav1'>
//         <h2 className='sidehead'>WTS (Womeki Tech Solutions)</h2>
//       </div>
//       <ul className="sidebar">
//         <div className='mt-5'>
//           <li className='Links'>
//             <Link to="/AdminDashboard">
//               <AiOutlineDashboard /> Dashboard
//             </Link>
//           </li>
//           <li className='Links'>
//             <Link to="/Adminuser">
//               <AiOutlineDashboard /> User
//             </Link>
//           </li>
//           <div className="dropdown">
//             <li className="dropdown-toggle" onClick={() => handleDropdownToggle('projectMaster')}>
//               <PiFolders /> Project Master
//             </li>
//             <div className={`dropdown-menu ${activeDropdown === 'projectMaster' ? 'active' : ''}`} aria-labelledby="dropdownMenuButton">
//               <li className="dropdown-item">
//                 <Link to='/Projects'><MdOutlineCircle /> Upload Project</Link>
//               </li>
//               <li className="dropdown-item">
//                 <Link to='/Addblock'><MdOutlineCircle /> Add Block</Link>
//               </li>
//               <li className="dropdown-item">
//                 <Link to='/Addunit'><MdOutlineCircle /> Add Unit</Link>
//               </li>
//             </div>
//           </div>
//           <div className="dropdown">
//             <li className="dropdown-toggle" onClick={() => handleDropdownToggle('paymentPlan')}>
//               <FontAwesomeIcon icon={faListCheck} className='mar' /> Payment Plan
//             </li>
//             <div className={`dropdown-menu ${activeDropdown === 'paymentPlan' ? 'active' : ''}`} aria-labelledby="dropdownMenuButton">
//               <li className="dropdown-item">
//                 <Link to='/Addplan'><MdOutlineCircle /> Add Plan</Link>
//               </li>
//               <li className="dropdown-item">
//                 <Link to='/ViewPlan'><MdOutlineCircle /> View Plan</Link>
//               </li>
//             </div>
//           </div>
//           <div className="dropdown">
//             <li className="dropdown-toggle" onClick={() => handleDropdownToggle('customer')}>
//               <IoIosDesktop /> Customer
//             </li>
//             <div className={`dropdown-menu ${activeDropdown === 'customer' ? 'active' : ''}`} aria-labelledby="dropdownMenuButton">
//               <li className="dropdown-item">
//                 <Link to='/Addcustomer'>
//                   <FontAwesomeIcon icon={faPerson} className='mar' /><MdOutlineCircle /> Add Customer
//                 </Link>
//               </li>
//               <li className="dropdown-item">
//                 <Link to='/ViewCustomer'>
//                   <FontAwesomeIcon icon={faPerson} className='mar' /><MdOutlineCircle /> View Customer
//                 </Link>
//               </li>
//             </div>
//           </div>
//           <div className="dropdown">
//             <li className="dropdown-toggle" onClick={() => handleDropdownToggle('payments')}>
//               <FaPenToSquare /> Payments
//             </li>
//             <div className={`dropdown-menu ${activeDropdown === 'payments' ? 'active' : ''}`} aria-labelledby="dropdownMenuButton">
//               <li className="dropdown-item">
//                 <Link to='/ReceivedPayments'><MdOutlineCircle /> Receive Payment</Link>
//               </li>
//               <li className="dropdown-item">
//                 <Link to='/PayInterestAmount'><MdOutlineCircle /> Pay Interest Amount</Link>
//               </li>
//             </div>
//           </div>
//           <li className='Links' onClick={handleSubmit}>
//             <Link>
//               <MdLogout /> Logout
//             </Link>
//           </li>
//           <ConfirmationModal
//             show={showConfirm}
//             onClose={() => setShowConfirm(false)}
//             onConfirm={() => { setShowConfirm(false); logOut(); }}
//             message="Are you sure you want to Logout?"
//           />
//         </div>
//       </ul>
//     </div>
//   );
// };

// export default Sidebar;
import React,{useState} from 'react'
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from 'react-router-dom';
import './Side.css';
import { FaRegUser } from "react-icons/fa";
import { MdPayments } from "react-icons/md";
import { RiSecurePaymentLine } from "react-icons/ri";
import { TfiUser } from "react-icons/tfi";
import ConfirmationModal from '../Confirmation/ConfirmationModal';
import { IoLogOutSharp } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import { AiOutlineFundProjectionScreen } from "react-icons/ai";
import { RiDashboard3Line } from "react-icons/ri";
import { MdOutlinePayments } from "react-icons/md";
const Sidebar = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const handleDropdownToggle = (dropdownId) => {
       setActiveDropdown(activeDropdown === dropdownId ? null : dropdownId);
     };
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); 
  const logOut = () => {
    window.localStorage.clear();
    navigate('/sign-in');
  };

  const handleSubmit = () => {
    setShowConfirm(true);
  };
  return (
    <div>
    <div className='newside'>
      <div className=''>
        <img src='./WTSlogo.png' className='sidelogo' alt=''/>
      </div>
      <div className=''>
      <Link to="/AdminDashboard"><div className={`Sidelink ${location.pathname === '/AdminDashboard' ? 'active' : ''}`}><RiDashboard3Line  className='svg-icon' />DashBoard</div></Link>
      <Link to="/Adminuser"><div className={`Sidelink ${location.pathname === '/Adminuser' ? 'active' : ''}`}><FaRegUser  className='svg-icon' />User</div></Link>
        <div className="dropdown">
            <div className="dropdown-toggle" onClick={() => handleDropdownToggle('projectMaster')}><AiOutlineFundProjectionScreen  className='svg-icon' />Project Master <IoIosArrowDown /></div>
            <div className={`dropdown-menu ${activeDropdown === 'projectMaster' ? 'active' : ''}`} aria-labelledby="dropdownMenuButton">
              <Link to='/Projects'><li className="dropdown-item">Upload Project</li></Link>
              <Link to='/Addblock'><li className="dropdown-item">Add Block</li></Link>
              <Link to='/Addunit'><li className="dropdown-item">Add Unit</li></Link>
            </div>
          </div>
          <div className="dropdown">
             <div className="dropdown-toggle" onClick={() => handleDropdownToggle('paymentPlan')}>
             <RiSecurePaymentLine className='svg-icon' />Payment Plan <IoIosArrowDown />
             </div>
             <div className={`dropdown-menu ${activeDropdown === 'paymentPlan' ? 'active' : ''}`} aria-labelledby="dropdownMenuButton">
             <Link to='/Addplan'><li className="dropdown-item"> Add Plan</li></Link>
             <Link to='/ViewPlan'><li className="dropdown-item">View Plan</li></Link>
             </div>
           </div>
           <div className="dropdown">
            <div className="dropdown-toggle" onClick={() => handleDropdownToggle('customer')}>
            <TfiUser className='svg-icon'/>Customer <IoIosArrowDown />
            </div>
            <div className={`dropdown-menu ${activeDropdown === 'customer' ? 'active' : ''}`} aria-labelledby="dropdownMenuButton">
            <Link to='/Addcustomer'><li className="dropdown-item">Add Customer</li></Link>
              <Link to='/ViewCustomer'><li className="dropdown-item">View Customer</li></Link>
            </div>
          </div>
          <div className="dropdown">
            <div className="dropdown-toggle" onClick={() => handleDropdownToggle('Payments')}>
            <MdOutlinePayments  className='svg-icon' />Payment <IoIosArrowDown />
            </div>
            <div className={`dropdown-menu ${activeDropdown === 'Payments' ? 'active' : ''}`} aria-labelledby="dropdownMenuButton">
            <Link to='/ReceivedPayments'><li className="dropdown-item">Received Payment</li></Link>
              <Link to='/PayInterestAmount'><li className="dropdown-item">Pay Interest Amount</li></Link>
            </div>
          </div>
        </div>
        
    </div>
    <div className='center1'>
    <div className='sabove'>
      <div>
        <img src='./userface.png' className='userface' alt='' />
        
      </div>
      <div>
      <IoLogOutSharp onClick={handleSubmit}/>

<ConfirmationModal
            show={showConfirm}
            onClose={() => setShowConfirm(false)}
            onConfirm={() => { setShowConfirm(false); logOut(); }}
            message="Are you sure you want to Logout?"
          />
      </div>
    </div>
    </div>
    </div>
  )
}
export default Sidebar
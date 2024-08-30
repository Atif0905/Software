import React,{useState} from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faL, faListCheck, faPerson  } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import { MdOutlineCircle, MdLogout  } from "react-icons/md";
import { PiFolders } from "react-icons/pi";
import { IoIosDesktop } from "react-icons/io";
import { AiOutlineDashboard } from "react-icons/ai";
import { CgCalendarDates } from "react-icons/cg";
import { FaRegFolder } from "react-icons/fa";
import { FaPenToSquare } from "react-icons/fa6";
import ConfirmationModal from '../Confirmation/ConfirmationModal';
const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isopen1, setIsopen1] = useState(false);
  const [isopen2, setIsopen2] = useState(false);
  const [isopen3, setIsopen3] = useState(false);
  const [isopen4, setIsopen4] = useState(false);
  const [isopen5, setIsopen5] = useState(false);
  const [isopen6, setIsopen6] = useState(false);
  const [isopen7, setIsopen7] = useState(false);
  const [isopen8, setIsopen8] = useState(false);
  const [isopen9, setIsopen9] = useState(false);
  const [isopen10, setIsopen10] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();
  const toggleDropdown = () => {
    setIsOpen(!isOpen); 
    setIsopen1(false);
    setIsopen2(false)
    setIsopen3(false)
    setIsopen4(false)
    setIsopen5(false)
    setIsopen6(false)
    setIsopen7(false)
    setIsopen8(false)
    setIsopen9(false)
    setIsopen10(false)
  };
  const toggleDropdown1 = () => {
    setIsopen1(!isopen1);
    setIsOpen(false); 
    setIsopen2(false)
    setIsopen3(false)
    setIsopen4(false)
    setIsopen5(false)
    setIsopen6(false)
    setIsopen7(false)
    setIsopen8(false)
    setIsopen9(false)
    setIsopen10(false)
  };
  const toggleDropdown2 = () => {
    setIsopen2(!isopen2);
    setIsOpen(false);
    setIsopen1(false) 
    setIsopen3(false)
    setIsopen4(false)
    setIsopen5(false)
    setIsopen6(false)
    setIsopen7(false)
    setIsopen8(false)
    setIsopen9(false)
    setIsopen10(false)
  };
  const toggleDropdown3 = () => {
    setIsopen3(!isopen3);
    setIsOpen(false);
    setIsopen1(false) 
    setIsopen2(false)
    setIsopen4(false)
    setIsopen5(false)
    setIsopen6(false)
    setIsopen7(false)
    setIsopen8(false)
    setIsopen9(false)
    setIsopen10(false)
  };
  const toggleDropdown4 = () => {
    setIsopen4(!isopen4);
    setIsOpen(false);
    setIsopen1(false) 
    setIsopen2(false)
    setIsopen3(false)
    setIsopen5(false)
    setIsopen6(false)
    setIsopen7(false)
    setIsopen8(false)
    setIsopen9(false)
    setIsopen10(false)
  };
  const toggleDropdown5 = () => {
    setIsopen5(!isopen5);
    setIsOpen(false);
    setIsopen1(false) 
    setIsopen2(false)
    setIsopen3(false)
    setIsopen4(false)
    setIsopen6(false)
    setIsopen7(false)
    setIsopen8(false)
    setIsopen9(false)
    setIsopen10(false)
  };
  const toggleDropdown6 = () => {
    setIsopen6(!isopen6);
    setIsOpen(false);
    setIsopen1(false) 
    setIsopen2(false)
    setIsopen3(false)
    setIsopen4(false)
    setIsopen7(false)
    setIsopen8(false)
    setIsopen9(false)
    setIsopen10(false)
  };
  const toggleDropdown7 = () => {
    setIsopen7(!isopen7);
    setIsOpen(false);
    setIsopen1(false) 
    setIsopen2(false)
    setIsopen3(false)
    setIsopen4(false)
    setIsopen6(false)
    setIsopen8(false)
    setIsopen9(false)
    setIsopen10(false)
  };
  const toggleDropdown8 = () => {
    setIsopen8(!isopen8);
    setIsOpen(false);
    setIsopen1(false) 
    setIsopen2(false)
    setIsopen3(false)
    setIsopen4(false)
    setIsopen6(false)
    setIsopen7(false)
    setIsopen9(false)
    setIsopen10(false)
  };
  const toggleDropdown9 = () => {
    setIsopen9(!isopen9);
    setIsOpen(false);
    setIsopen1(false) 
    setIsopen2(false)
    setIsopen3(false)
    setIsopen4(false)
    setIsopen6(false)
    setIsopen7(false)
    setIsopen8(false)
    setIsopen10(false)
  };
  const toggleDropdown10 = () => {
    setIsopen10(!isopen10);
    setIsOpen(false);
    setIsopen1(false) 
    setIsopen2(false)
    setIsopen3(false)
    setIsopen4(false)
    setIsopen6(false)
    setIsopen7(false)
    setIsopen8(false)
    setIsopen9(false)
  };
  const logOut = () => {
      window.localStorage.clear();
      navigate("/sign-in");
  };
  const handleSubmit =() => {
    
    setShowConfirm(true);
  }
  return (
    <div>
      <div className='nav1'><h1 className='sidehead'>WIC</h1> </div>
      <ul className="sidebar">
        <div className='mt-5'>
          <li className='Links'><Link to="/"><AiOutlineDashboard/>Dashboard</Link></li>
          <li className='Links'><Link to="/Adminuser"><AiOutlineDashboard/>User</Link></li>
    <div className="dropdown">
      <li className="dropdown-toggle" onClick={toggleDropdown}> <PiFolders /> Project Master</li>
      <div className={"dropdown-menu" + (isOpen ? " active" : "")} aria-labelledby="dropdownMenuButton">
        <li className=" dropdown-item"><Link to='/Projects'><MdOutlineCircle /> Upload Project</Link></li>
        <li className=" dropdown-item"><Link to='/Addblock'><MdOutlineCircle /> Add block</Link></li>
        <li className=" dropdown-item"><Link to='/Addunit'><MdOutlineCircle /> Add Unit</Link></li>
      </div>
    </div>
    <div className="dropdown">
      <li className="dropdown-toggle" onClick={toggleDropdown2}> <FontAwesomeIcon icon={faListCheck} className='mar'/>Payment Plan</li>
      <div className={"dropdown-menu" + (isopen2 ? " active" : "")} aria-labelledby="dropdownMenuButton">
        <li className=" dropdown-item"><Link to='/Addplan'><MdOutlineCircle /> Add Plan</Link></li>
        <li className=" dropdown-item"><Link to='/ViewPlan' ><MdOutlineCircle /> View Plan</Link></li>
      </div>
    </div>
    <div className="dropdown">
      <li className="dropdown-toggle" onClick={toggleDropdown3}> <FontAwesomeIcon icon={faListCheck} className='mar'/>Incentive Plan</li>
      <div className={"dropdown-menu" + (isopen3 ? " active" : "")} aria-labelledby="dropdownMenuButton">
        <li className=" dropdown-item"><Link to='/Incentiveplan'><MdOutlineCircle /> View Plan</Link></li>
      </div>
    </div>
    <div className="dropdown">
      <li className="dropdown-toggle" onClick={toggleDropdown1}><IoIosDesktop /> Customer </li>
      <div className={"dropdown-menu" + (isopen1 ? " active" : "")} aria-labelledby="dropdownMenuButton">
        <li className=" dropdown-item"><Link to='/Addcustomer'><FontAwesomeIcon icon={faPerson} className='mar'/><MdOutlineCircle /> Add Customer</Link></li>
        <li className=" dropdown-item"><Link to='/ViewCustomer'><FontAwesomeIcon icon={faPerson} className='mar'/><MdOutlineCircle />  View Customer</Link></li>
      </div>
    </div>
    <div className="dropdown">
      <li className="dropdown-toggle" onClick={toggleDropdown4}> <FaPenToSquare /> Payments</li>
      <div className={"dropdown-menu" + (isopen4 ? " active" : "")} aria-labelledby="dropdownMenuButton">
        <li className=" dropdown-item"><Link to='/ReceivedPayments'><MdOutlineCircle /> Receive Payment</Link></li>
        <li className=" dropdown-item"><Link to='/PayInterestAmount'><MdOutlineCircle /> Pay Interest Amount</Link></li>
      </div>
    </div>
    <div className="dropdown">
      <li className="dropdown-toggle" onClick={toggleDropdown5}><CgCalendarDates /> Payment Report</li>
      <div className={"dropdown-menu" + (isopen5 ? " active" : "")} aria-labelledby="dropdownMenuButton">
        <li className=" dropdown-item"><Link ><MdOutlineCircle /> Total Payment</Link></li>
        <li className=" dropdown-item"><Link ><MdOutlineCircle /> Received Payment</Link></li>
      </div>
    </div>
    <div className="dropdown">
      <li className="dropdown-toggle" onClick={toggleDropdown6}><CgCalendarDates /> Project Sold Report</li>
      <div className={"dropdown-menu" + (isopen6 ? " active" : "")} aria-labelledby="dropdownMenuButton">
        <li className=" dropdown-item"><Link ><MdOutlineCircle /> Report</Link></li>
      </div>
    </div>
    <div className="dropdown">
      <li className="dropdown-toggle" onClick={toggleDropdown10}><PiFolders /> Registry Master</li>
      <div className={"dropdown-menu" + (isopen10 ? " active" : "")} aria-labelledby="dropdownMenuButton">
        <li className=" dropdown-item"><Link to='/Addkhata' ><MdOutlineCircle /> Add khata</Link></li>
        <li className=" dropdown-item"><Link to='/Viewkhata'><MdOutlineCircle /> view khata</Link></li>
        <li className=" dropdown-item"><Link to='/Addkhasra'><MdOutlineCircle /> Add khasra</Link></li>
        <li className=" dropdown-item"><Link to='/Viewkhasra'><MdOutlineCircle /> Add khasra</Link></li>
      </div>
    </div>
    <div className="dropdown">
      <li className="dropdown-toggle" onClick={toggleDropdown7}> <FaRegFolder /> Other</li>
      <div className={"dropdown-menu" + (isopen7 ? " active" : "")} aria-labelledby="dropdownMenuButton">
        <li className=" dropdown-item"><Link ><MdOutlineCircle /> Logs</Link></li>
        <li className=" dropdown-item"><Link ><MdOutlineCircle /> Wishes</Link></li>
      </div>
    </div>
    {/* <div className="dropdown">
      <li className="dropdown-toggle" onClick={toggleDropdown8}> <FaRegFolder /> Accounts</li>
      <div className={"dropdown-menu" + (isopen8 ? " active" : "")} aria-labelledby="dropdownMenuButton">
        <li className=" dropdown-item"><Link ><MdOutlineCircle /> Agents</Link></li>
        <li className=" dropdown-item"><Link ><MdOutlineCircle /> Release Incentive</Link></li>
      </div>
    </div> */}
    <div className="dropdown">
      <li className="dropdown-toggle" onClick={toggleDropdown9}> <FaRegFolder /> Password</li>
      <div className={"dropdown-menu" + (isopen9 ? " active" : "")} aria-labelledby="dropdownMenuButton">
        <li className=" dropdown-item"><Link ><MdOutlineCircle /> Change Password</Link></li>
      </div>
    </div>
      <li className='Links' onClick={handleSubmit}><Link ><MdLogout />Logout</Link></li>
      <ConfirmationModal  show={showConfirm} onClose={() => setShowConfirm(false)} onConfirm={() => { setShowConfirm(false); logOut(); }}
        message="Are you sure you want to Logout?"/>
        </div>
      </ul>
    </div>
  );
};
export default Sidebar;
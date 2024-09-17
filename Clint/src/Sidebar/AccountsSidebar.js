
import React,{useState} from 'react'
import { useNavigate } from "react-router-dom";
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
const AccountsSidebar = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const handleDropdownToggle = (dropdownId) => {
       setActiveDropdown(activeDropdown === dropdownId ? null : dropdownId);
     };
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();
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
      <Link to="/AccountsDashBoard"><div className='Sidelink'><RiDashboard3Line  className='svg-icon' />DashBoard</div></Link>
      <Link to="/PaymentPerUnit"><div className='Sidelink'><FaRegUser  className='svg-icon' />Payment Per Unit</div></Link>
      <Link to="/Stats"><div className='Sidelink'><FaRegUser  className='svg-icon' />Stats</div></Link>
      <Link to="/ExpenseForm"><div className='Sidelink'><FaRegUser  className='svg-icon' />Expenses</div></Link>
      <Link to="/Expensedetails"><div className='Sidelink'><FaRegUser  className='svg-icon' />Paid Expenses</div></Link>
        <p className='Sidelink'></p>
        </div>
        <div><img src='./sidebarimg.png' className='sidebarimg' alt=''/></div>
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
export default AccountsSidebar
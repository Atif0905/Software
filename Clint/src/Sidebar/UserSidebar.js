import React,{useState} from 'react'
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import './Side.css';
import { AiOutlineDashboard } from 'react-icons/ai';
import { FaUser } from "react-icons/fa";
import { GoProject } from "react-icons/go";
import { MdPayments } from "react-icons/md";
import { RiSecurePaymentLine } from "react-icons/ri";
import { TfiUser } from "react-icons/tfi";
import ConfirmationModal from '../Confirmation/ConfirmationModal';
const UserSidebar = () => {
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
      <div className='mt-5'>
        <p className='Sidelink'><AiOutlineDashboard className='svg-icon' />Dashboard</p>
        <p className='Sidelink'><FaUser className='svg-icon' />User</p>
        <p className='Sidelink'><GoProject className='svg-icon' />Project Master</p>
        <p className='Sidelink'><RiSecurePaymentLine className='svg-icon' />Payment Plan</p>
        <p className='Sidelink'><TfiUser className='svg-icon'/>Customer</p>
        <p className='Sidelink'><MdPayments className='svg-icon' />Payments</p>
        </div>
    </div>
    <div className='center1'>
    <div className='sabove'>
      <div>
        <img src='./userface.png' className='userface' alt='' />
        
      </div>
      <div>
      <svg onClick={handleSubmit} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="logouticon">
  <path fillRule="evenodd" d="M16.5 3.75a1.5 1.5 0 0 1 1.5 1.5v13.5a1.5 1.5 0 0 1-1.5 1.5h-6a1.5 1.5 0 0 1-1.5-1.5V15a.75.75 0 0 0-1.5 0v3.75a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V5.25a3 3 0 0 0-3-3h-6a3 3 0 0 0-3 3V9A.75.75 0 1 0 9 9V5.25a1.5 1.5 0 0 1 1.5-1.5h6Zm-5.03 4.72a.75.75 0 0 0 0 1.06l1.72 1.72H2.25a.75.75 0 0 0 0 1.5h10.94l-1.72 1.72a.75.75 0 1 0 1.06 1.06l3-3a.75.75 0 0 0 0-1.06l-3-3a.75.75 0 0 0-1.06 0Z" clipRule="evenodd" />
</svg>
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
export default UserSidebar
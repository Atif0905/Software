import React,{useState} from 'react'
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import './Sidebar.css';
import { MdLogout  } from "react-icons/md";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChalkboardUser, faMoneyBill , faClipboard , faChartBar, faFileInvoice   } from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from '../Confirmation/ConfirmationModal';
const AccountsSidebar = () => {
    const [showConfirm, setShowConfirm] = useState(false);
    const navigate = useNavigate();
    const logOut = () => {
        window.localStorage.clear();
        navigate("/sign-in");
    };
  const handleSubmit =() => {
    
    setShowConfirm(true);
  }
  return (
    <div>
    <div className='nav1'> </div>
    <ul className="sidebar ">
    <div className='nav d-flex justify-content-center'>
    <h1 className='sidehead mt-2'>WIC</h1>
    </div>
    <div className=''>
    <li className='Links mt-2'><Link to="/"><FontAwesomeIcon icon={faChalkboardUser} className='mar'/>Dashboard</Link></li>
    <li className='Links'><Link to="/PaymentPerUnit"><FontAwesomeIcon icon={faFileInvoice} className='mar'/>Payment Per Unit</Link></li>
    <li className='Links'><Link to="/Stats"><FontAwesomeIcon icon={faChartBar} className='mar'/>Stats</Link></li>
    <li className='Links'><Link to="/DirectorsReport"><FontAwesomeIcon icon={faClipboard} className='mar'/>Directors Report</Link></li>
    <li className='Links'><Link to="/ExpenseForm"><FontAwesomeIcon icon={faMoneyBill} className='mar'/>Expenses</Link></li>
    <li className='Links'><Link to="/Expensedetails"><FontAwesomeIcon icon={faMoneyBill} className='mar'/>Paid Expenses</Link></li>
    <li className='Links' onClick={handleSubmit}><Link ><MdLogout />Logout</Link></li>
      <ConfirmationModal  show={showConfirm} onClose={() => setShowConfirm(false)} onConfirm={() => { setShowConfirm(false); logOut(); }}
        message="Are you sure you want to Logout?"/>
      </div>
    </ul>
  </div>
  )
}

export default AccountsSidebar
import React, { useState, useEffect} from "react";
import axios from "axios";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Loginandsignup/login_component";
import SignUp from "./components/Loginandsignup/signup_component";
import UserDetails from "./components/userDetails";
import AdminDashboard from "./Home/AdminDashboard/AdminDashboard";
import UploadedProjects from "./Home/AdminDashboard/ShowProjects";
import ProjectDetails from "./Home/AdminDashboard/Uploads/ProjectDetails";
import Sidebar from "./Sidebar/Sidebar";
import Projects from "./UpdateProjects/Projects";
import Reports from "./components/Reports/Reports";
import AdminUser from "./User/AdminUser";
import AdditionBlock from "./Home/AdminDashboard/Addblockandunit/AdditionBlock";
import AdditionUnit from "./Home/AdminDashboard/Addblockandunit/AdditionUnit";
import AddCustomerForm from "./Home/AdminDashboard/Uploads/Coustmer";
import ViewCastumer from "./Home/AdminDashboard/ViewCastumer";
import Addplan from "./PaymentPlan/Addplan";
import Viewplan from "./PaymentPlan/Viewplan";
import Incentiveplan from "./Incentiveplan/Incentiveplan";
import Receivedpayments from "./Payments/Receivedpayments";
import Addkhata from "./Registry/Addkhata";
import Addkhasra from "./Registry/Addkhasra";
import ViewKhata from "./Registry/Viewkhata"
import Viewkhasra from './Registry/Viewkhasra'
import PaymentPage from "./Payments/Paymentpage";
import AdminPanel from "./AdminPanel/AdminPanel";
import BlogPanel from "./AdminPanel/BlogPanel";
import MasterAdmin from "./AdminPanel/MasterAdmin";
import CustomerDetails from "./components/Customer/CustomerDetails";
import Editcustomerdetails from "./components/Customer/Editcustomerdetails";
import Print_reciept from "./Print/Print_Reciept";
import Edit_Payment from "./Print/Edit_Payment";
import DemandDraft from "./Print/DemandDraft";
import Welcomeletter from "./Print/Welcomeletter";
import Ledger from "./Print/Ledger";
import PaymentPerunit from "./Accountscomponent/PaymentPerunit";
import AccountsSidebar from "./Sidebar/AccountsSidebar";
import Stats from "./Accountscomponent/Stats";
import DirectorsReport from "./Accountscomponent/DirectorsReport";
import DirectorDetails from "./Accountscomponent/DirectorDetails";
import PayInterestAmount from "./Payments/PayInterestAmount";
import PrintPage from "./Print/PrintPage";
import FilteredPrintPage from "./Print/FilteredPrintPage";
import AccountsDashboard from "./Home/AdminDashboard/AccountsDashboard";
import ExpenseForm from "./Accountscomponent/Expenses/ExpenseForm";
import Expensedetails from "./Accountscomponent/Expenses/Expensedetails";
import ExpensePaidByteamLeader from "./Accountscomponent/Expenses/ExpensePaidByteamLeader";
import EditExpense from "./Accountscomponent/Expenses/EditExpense";
import ChanelPartnerForm from "./ChanelPartnerForm/ChanelPartnerForm";
import AccountsProjects from "./Accountscomponent/AccountsProjects";
function App() {
  const isLoggedIn = window.localStorage.getItem("loggedIn");
  const [userData, setUserData] = useState({});
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    axios.post(`${process.env.REACT_APP_API_URL}/userData`, {
      token: window.localStorage.getItem("token"),
    })
    .then((response) => {
      const data = response.data;
      if (data.data && data.data.userType === "Admin") {
        setAdmin(true);
      }
      setUserData(data.data);
    })
    .catch((error) => {
      console.error('Error fetching user data:', error);
    });
  }, [userData]);
  return (
    <Router>
      <div className="App">        
        <Routes>
          {/* Sidebar routes */}
          <Route path="/" element={<Navigate to="/DashBoard" />} /> 
          {/* <Route path="/userDetails" element={<Sidebar />} /> */}
          <Route path="/AdminDashboard/*" element={<Sidebar />} />
          <Route path="/uploaded-projects" element={<Sidebar />} />
          <Route path="/project/:projectId" element={<Sidebar />} />
          <Route path="/user" element={<Sidebar/>} />
          <Route path="/Projects" element={<Sidebar />} />
          <Route path="/Reports" element={<Sidebar />} />
          <Route path="/Users-Reports" element={<Sidebar/>} />
          <Route path="/Adminuser" element={<Sidebar />} />
          <Route path="/Addblock" element={<Sidebar/>}/>
          <Route path="/Addunit" element={<Sidebar/>}/>
          <Route path="/Addcustomer" element={<Sidebar/>}/>
          <Route path="/ViewCustomer" element={<Sidebar/>}/>
          <Route path="/AddPlan" element={<Sidebar/>}/>
          <Route path="/ViewPlan" element={<Sidebar/>}/>
          <Route path="/Incentiveplan" element={<Sidebar/>} />
          <Route path="/ReceivedPayments" element={<Sidebar/>} />
          <Route path="/PayInterestAmount" element={<Sidebar/>} />
          <Route path="/Addkhata" element={<Sidebar/>} />
          <Route path="/Addkhasra" element={<Sidebar/>} />
          <Route path="/Viewkhata" element={<Sidebar/>} />
          <Route path="/Viewkhasra" element={<Sidebar/>} />
          <Route path="/PaymentPage/:id" element={<Sidebar/>}/>
          <Route path="/Customer_Details/:_id" element={<Sidebar/>}/>
          <Route path="/Edit_Customer_Details/:_id" element={<Sidebar/>}/>
          <Route path="/edit_payment/:_id" element={<Sidebar/>}/> 
          <Route path="/AccountsDashBoard" element={<AccountsSidebar/>}/>
          <Route path="/PaymentPerUnit" element={<AccountsSidebar/>}/>
          <Route path="/Stats" element={<AccountsSidebar/>}/>
          <Route path="/DirectorsReport" element={<AccountsSidebar/>}/>
          <Route path="/DirectorDetails/:_id" element={<AccountsSidebar/>}/>
          <Route path="/ExpenseForm" element={<AccountsSidebar/>}/>
          <Route path="/Expensedetails" element={<AccountsSidebar/>}/>
          <Route path="/TotalExpensePaidByteamLeader/:_id" element={<AccountsSidebar/>}/>
          <Route path="/edit-expense" element={<AccountsSidebar />} />
          <Route path="/AllProjects" element={<Sidebar/>} />
          <Route path="/All-Projects" element={<AccountsSidebar/>} />
        </Routes>

        <Routes>
          <Route path="/" element={isLoggedIn === "true" ? <UserDetails /> : <Login />} />
          <Route path="/sign-in" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/DashBoard" element={<UserDetails />} />
          <Route path="/AdminDashboard" element={<AdminDashboard />} />
          <Route path="/uploaded-projects" element={<UploadedProjects />} />
          <Route path="/project/:projectId" element={<ProjectDetails />} />
          <Route path="/Adminuser" element={<AdminUser />} />
          <Route path="/Projects" element={<Projects />} />
          <Route path="/Reports" element={<Reports />} />
          <Route path="/Users-Projects" element={<Projects />} />
          <Route path="/Users-Reports" element={<Reports />} />
          <Route path="/Addblock" element={<AdditionBlock/>}/>
          <Route path="/Addunit" element={<AdditionUnit/>}/>
          <Route path="/Addcustomer" element={<AddCustomerForm/>}/>
          <Route path="/ViewCustomer" element={<ViewCastumer/>} />
          <Route path="/AddPlan" element={<Addplan/>} />
          <Route path='/ViewPlan' element={<Viewplan/>} />
          <Route path="/Incentiveplan" element={<Incentiveplan/>} />
          <Route path="/ReceivedPayments" element={<Receivedpayments/>} />
          <Route path="/PayInterestAmount" element={<PayInterestAmount/>} />
          <Route path="/Addkhata" element={<Addkhata/>}/>
          <Route path="/Addkhasra" element={<Addkhasra/>}/>
          <Route path="/Viewkhata" element={<ViewKhata/>} />
          <Route path="/PaymentPage/:id" element={<PaymentPage/>}/>
          <Route path="/Viewkhasra" element={<Viewkhasra/>}/>
          <Route path="/AdminPanel" element={<AdminPanel/>}/>
          <Route path="/BlogPanel" element={<BlogPanel/>}/>
          <Route path='/MasterAdmin' element={<MasterAdmin/>}/>
          <Route path="/Customer_Details/:_id" element={<CustomerDetails/>}/>
          <Route path="/Edit_Customer_Details/:_id" element={<Editcustomerdetails/>}/>
          <Route path="/print_reciept/:_id" element={<Print_reciept/>}/>
          <Route path="/edit_payment/:_id" element={<Edit_Payment/>}/>
          <Route path="/print_demand_datewise/:_id" element={<DemandDraft/>}/>
          <Route path="/welcomeletter/:_id" element={<Welcomeletter/>}/>
          <Route path="/ledger/:_id" element={<Ledger/>}/>
          <Route path="/AccountsDashBoard" element={<AccountsDashboard/>}/>
          <Route path="/PaymentPerUnit" element={<PaymentPerunit/>}/>
          <Route path="/Stats" element={<Stats/>}/>
          <Route path="/DirectorsReport" element={<DirectorsReport/>}/>
          <Route path="/DirectorDetails/:_id" element={<DirectorDetails/>}/>
          <Route path="/ExpenseForm" element={<ExpenseForm/>}/>
          <Route path="/Expensedetails" element={<Expensedetails/>}/>
          <Route path="/TotalExpensePaidByteamLeader/:_id" element={<ExpensePaidByteamLeader/>}/>
          <Route path="print-page" element={<PrintPage/>}/>
          <Route path="FilteredPrintPage" element={<FilteredPrintPage/>}/>
          <Route path="/edit-expense" element={<EditExpense />} />
          <Route path="/Chanel-Partner-form" element={<ChanelPartnerForm/>} />
          <Route path="/AllProjects" element={<div className=""><UploadedProjects/></div>} />
          <Route path="/All-Projects" element={<div className="main-content"><AccountsProjects/></div>} />
        </Routes>
      </div>
    </Router>
  );
}
export default App;

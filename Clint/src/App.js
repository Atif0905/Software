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
import AccountsProjects from "./Accountscomponent/AccountsProjects";
import SendEmail from "./Reminder/Sendmail";
import CreateUser from "./AdminUsers/CreateUser";
import AssgProject from "./AdminUsers/AssgProject";
import SubAdminDash from "./Home/SubAdminDashboard/SubAdminDash";
import SubAdmin from "./Sidebar/SubAdmin";
import Subadminviewcustomer from "./SubAdmincomponent/Subadminviewcustomer";
import SubadminCustomerdetail from "./SubAdmincomponent/SubadminCustomerdetail";
import Subadmincustomeredit from "./SubAdmincomponent/Subadmincustomeredit";
import SubAdminAddcustomer from "./SubAdmincomponent/SubAdmincustomer";
import SubadminRecivecustomer from "./SubAdmincomponent/SubadminRecivecustomer";
import Info from "./Info/Info";
import UpdateLogoPage from "./Sidebar/UpdateLogoPage";
import Superadmindashboard from "./SuperAdmin/Superadmindashboard";
import Superadminsidebar from "./Sidebar/Superadminsidebar";
import ProductPage from "./SuperAdmin/ProductPage";
import Superadminstats from "./SuperAdmin/Superadminstats";
import UserSidebar from "./Sidebar/UserSidebar";
import UserDashBoard from "./Home/UserDashboard/UserDashBoard";
import Holdhistory from "./Home/UserDashboard/Holdhistory";
import AdminHoldhistory from "./Home/AdminDashboard/AdminHoldhistory";

function ProtectedRoute({ element: Component, ...rest }) {
  const isLoggedIn = window.localStorage.getItem("loggedIn") === "true";
  return isLoggedIn ? <Component {...rest} /> : <Navigate to="/sign-in" />;
} 

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
          <Route path="/" element={<Navigate to="/sign-in" />} />
          <Route path="/AdminDashboard/*" element={<Sidebar />} />
          <Route path="/uploaded-projects" element={<Sidebar />} />
          <Route path="/project/:projectId" element={<Sidebar />} />
          <Route path="/user" element={<Sidebar/>} />
          <Route path="/Projects" element={<Sidebar />} />
          <Route path="/Reports" element={<Sidebar />} />
          <Route path="/Users-Reports" element={<Sidebar/>} />
          <Route path="/Adminuser" element={<Superadminsidebar />} />
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
          <Route path="/reminder" element={<Sidebar/>} />
          <Route path="/Register-User-Admin" element={<Sidebar/>}/>
          <Route path="/AssgProject" element={<Sidebar/>} />
          <Route path="/Sub-Admin-Dashboard" element={<SubAdmin/>}/>
          <Route path="/Sub-Admin-View-customer" element={<SubAdmin/>} />
          <Route path="/Sub-Admin-customer-details/:_id" element={<SubAdmin/>} />
          <Route path="/Sub-Admin-Edit-customer-details/:_id" element={<SubAdmin/>} />
          <Route path="/Sub-Admin-Add-customer" element={<SubAdmin/>} />
          <Route path="/Sub-Admin-Receive-customer" element={<SubAdmin/>} />
          <Route path="/Info" element={<Superadminsidebar/>} />
          <Route path="/SuperAdminDashboard" element={<Superadminsidebar/>}/>
          <Route path="/Product" element={<Superadminsidebar/>} />
          <Route path="/Sales-Analytics" element={<Superadminsidebar/>}/>
          <Route path="/UserDashboard" element={<UserSidebar/>}/>
          <Route path="/Hold-History" element={<UserSidebar/>}/>
          <Route path="/Admin-Hold-History" element={<Sidebar/>}/>
        </Routes>
        <Routes>
        <Route path="/" element={isLoggedIn === "true" ? <UserDetails /> : <Login />} />
    <Route path="/sign-in" element={<Login />} />
    <Route path="/sign-up" element={<SignUp />} />

    {/* Admin Dashboard Routes */}
    <Route path="/DashBoard" element={<ProtectedRoute element={UserDetails} />} />
    <Route path="/AdminDashboard" element={<ProtectedRoute element={AdminDashboard} />} />
    <Route path="/AccountsDashBoard" element={<ProtectedRoute element={AccountsDashboard} />} />
    <Route path="/Register-User-Admin" element={<ProtectedRoute element={CreateUser} />} />
    <Route path="/AssgProject" element={<ProtectedRoute element={AssgProject} />} />
    <Route path="/uploaded-projects" element={<ProtectedRoute element={UploadedProjects} />} />
    <Route path="/project/:projectId" element={<ProtectedRoute element={ProjectDetails} />} />
    <Route path="/Projects" element={<ProtectedRoute element={Projects} />} />
    <Route path="/AllProjects" element={<ProtectedRoute element={UploadedProjects} />} />
    <Route path="/All-Projects" element={<ProtectedRoute element={AccountsProjects} />} />
    <Route path="/Info" element={<ProtectedRoute element={Info} />} />
    <Route path="/Admin-Hold-History" element={<ProtectedRoute element={AdminHoldhistory} />} />
    <Route path="/Users-Projects" element={<ProtectedRoute element={Projects} />} />
    <Route path="/Users-Reports" element={<ProtectedRoute element={Reports} />} />
    <Route path="/Addcustomer" element={<ProtectedRoute element={AddCustomerForm} />} />
    <Route path="/ViewCustomer" element={<ProtectedRoute element={ViewCastumer} />} />
    <Route path="/Customer_Details/:_id" element={<ProtectedRoute element={CustomerDetails} />} />
    <Route path="/Admin_details" element={<ProtectedRoute element={UpdateLogoPage} />} />
    <Route path="/Edit_Customer_Details/:_id" element={<ProtectedRoute element={Editcustomerdetails} />} />
    <Route path="/edit_payment/:_id" element={<ProtectedRoute element={Edit_Payment} />} /> 
    <Route path="/ReceivedPayments" element={<ProtectedRoute element={Receivedpayments} />} />
    <Route path="/PayInterestAmount" element={<ProtectedRoute element={PayInterestAmount} />} />
    <Route path="/PaymentPage/:id" element={<ProtectedRoute element={PaymentPage} />} />
    <Route path="/print_reciept/:_id" element={<ProtectedRoute element={Print_reciept} />} />
    <Route path="/MasterAdmin" element={<MasterAdmin/>}/>
    <Route path="/AdminPanel" element={<AdminPanel />} />
    <Route path="/BlogPanel" element={<BlogPanel />} />
    <Route path="/Addblock" element={<ProtectedRoute element={AdditionBlock} />} />
    <Route path="/Addunit" element={<ProtectedRoute element={AdditionUnit} />} />
    <Route path="/AddPlan" element={<ProtectedRoute element={Addplan} />} />
    <Route path="/ViewPlan" element={<ProtectedRoute element={Viewplan} />} />
    <Route path="/Incentiveplan" element={<ProtectedRoute element={Incentiveplan} />} />
    <Route path="/Stats" element={<ProtectedRoute element={Stats} />} />
    <Route path="/DirectorsReport" element={<ProtectedRoute element={DirectorsReport} />} />
    <Route path="/DirectorDetails/:_id" element={<ProtectedRoute element={DirectorDetails} />} />
    <Route path="/ExpenseForm" element={<ProtectedRoute element={ExpenseForm} />} />
    <Route path="/Expensedetails" element={<ProtectedRoute element={Expensedetails} />} />
    <Route path="/TotalExpensePaidByteamLeader/:_id" element={<ProtectedRoute element={ExpensePaidByteamLeader} />} />
    <Route path="/Sub-Admin-Dashboard" element={<ProtectedRoute element={SubAdminDash} />} />
    <Route path="/Sub-Admin-View-customer" element={<ProtectedRoute element={Subadminviewcustomer} />} />
    <Route path="/Sub-Admin-customer-details/:_id" element={<ProtectedRoute element={SubadminCustomerdetail} />} />
    <Route path="/Sub-Admin-Edit-customer-details/:_id" element={<ProtectedRoute element={Subadmincustomeredit} />} />
    <Route path="/Sub-Admin-Add-customer" element={<ProtectedRoute element={SubAdminAddcustomer} />} />
    <Route path="/Sub-Admin-Receive-customer" element={<ProtectedRoute element={SubadminRecivecustomer} />} />
    <Route path="/print_demand_datewise/:_id" element={<ProtectedRoute element={DemandDraft} />} />
    <Route path="/welcomeletter/:_id" element={<ProtectedRoute element={Welcomeletter} />} />
    <Route path="/ledger/:_id" element={<ProtectedRoute element={Ledger} />} />
    <Route path="/PaymentPerUnit" element={<ProtectedRoute element={PaymentPerunit} />} />
    <Route path="/reminder" element={<ProtectedRoute element={SendEmail} />} />
    <Route path="print-page" element={<ProtectedRoute element={PrintPage} />} />
    <Route path="FilteredPrintPage" element={<ProtectedRoute element={FilteredPrintPage} />} />
    <Route path="/edit-expense" element={<ProtectedRoute element={EditExpense} />} />
    <Route path="/Adminuser" element={<ProtectedRoute element={AdminUser} />} />
    <Route path="/SuperAdminDashboard" element={<ProtectedRoute element={Superadmindashboard}/>}/>
    <Route path="/Product" element={<ProtectedRoute element={ProductPage}/>}/>
    <Route path="/Sales-Analytics" element={<ProtectedRoute element={Superadminstats}/>}/>
    <Route path="/UserDashboard" element={<ProtectedRoute element={UserDashBoard}/>}/>
    <Route path="/Hold-History" element={<ProtectedRoute element={Holdhistory}/>}/>
    </Routes>
      </div>
    </Router>
  );
}
export default App;
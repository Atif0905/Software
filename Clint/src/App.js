import React, { useState, useEffect} from "react";
import axios from "axios";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/login_component";
import SignUp from "./components/signup_component";
import UserDetails from "./components/userDetails";
import AdminDashboard from "./Home/AdminDashboard/AdminDashboard";
import UploadedProjects from "./Home/AdminDashboard/ShowProjects";
import ProjectDetails from "./Home/AdminDashboard/Uploads/ProjectDetails";
import Sidebar from "./Sidebar/Sidebar";
import User from "./User/AdminUser";
import Projects from "./UpdateProjects/Projects";
import Reports from "./components/Reports/Reports";
import UserSidebar from './Sidebar/UserSidebar'
import Userprojects from "./UpdateProjects/Userprojects";
import UserReports from "./components/Reports/UserReports";
import AdminUser from "./User/AdminUser";
import AdditionBlock from "./Home/AdminDashboard/Addblockandunit/AdditionBlock";
import AdditionUnit from "./Home/AdminDashboard/Addblockandunit/AdditionUnit";
import AddCustomerForm from "./Home/AdminDashboard/Uploads/Coustmer";
import ViewCastumer from "./Home/AdminDashboard/ViewCastumer";
import Addplan from "./PaymentPlan/Addplan";
import Viewplan from "./PaymentPlan/Viewplan";
import Incentiveplan from "./Incentiveplan/Incentiveplan";
import Receivedpayments from "./Payments/Receivedpayments";
import Unclearcheque from "./Payments/Unclearcheque";
import Addkhata from "./Registry/Addkhata";
import Addkhasra from "./Registry/Addkhasra";
import ViewKhata from "./Registry/Viewkhata"
import Viewkhasra from './Registry/Viewkhasra'
import PaymentPage from "./Payments/Paymentpage";
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
  const SidebarComponent = admin ? Sidebar : UserSidebar;
  return (
    <Router>
      <div className="App">        
          <Routes>
          <Route path="/" element={<Navigate to="/userDetails" />} /> 
          <Route path="/userDetails" element={<SidebarComponent />} />
          <Route path="/AdminDashboard/*" element={<SidebarComponent />} />
          <Route path="/uploaded-projects" element={<SidebarComponent />} />
          <Route path="/project/:projectId" element={<SidebarComponent />} />
          <Route path="/user" element={<SidebarComponent/>} />
          <Route path="/Projects" element={<SidebarComponent />} />
          <Route path="/Reports" element={<SidebarComponent />} />
          <Route path="/Users-Reports" element={<SidebarComponent/>} />
          <Route path="/Adminuser" element={<SidebarComponent />} />
          <Route path="/Addblock" element={<SidebarComponent/>}/>
          <Route path="/Addunit" element={<SidebarComponent/>}/>
          <Route path="/Addcustomer" element={<SidebarComponent/>}/>
          <Route path="/ViewCustomer" element={<SidebarComponent/>}/>
          <Route path="/AddPlan" element={<SidebarComponent/>}/>
          <Route path="/ViewPlan" element={<SidebarComponent/>}/>
          <Route path="/Incentiveplan" element={<SidebarComponent/>} />
          <Route path="/ReceivedPayments" element={<SidebarComponent/>} />
          <Route path="/Unclearchequedetails" element={<SidebarComponent/>} />
          <Route path="/Addkhata" element={<SidebarComponent/>} />
          <Route path="/Addkhasra" element={<SidebarComponent/>} />
          <Route path="/Viewkhata" element={<SidebarComponent/>} />
          <Route path="/Viewkhasra" element={<SidebarComponent/>} />
          <Route path="/PaymentPage/:id" element={<Sidebar/>}/>
          </Routes>
        <Routes>
          <Route path="/" element={isLoggedIn === "true" ? <UserDetails /> : <Login />} />
          <Route path="/sign-in" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/userDetails" element={<UserDetails />} />
          <Route path="/AdminDashboard" element={<AdminDashboard />} />
          <Route path="/uploaded-projects" element={<UploadedProjects />} />
          <Route path="/project/:projectId" element={<ProjectDetails />} />
          <Route path="/Adminuser" element={<AdminUser />} />
          <Route path="/Projects" element={<Projects />} />
          <Route path="/Reports" element={<Reports />} />
          <Route path="/Users-Projects" element={<Userprojects />} />
          <Route path="/Users-Reports" element={<UserReports />} />
          <Route path="/Addblock" element={<AdditionBlock/>}/>
          <Route path="/Addunit" element={<AdditionUnit/>}/>
          <Route path="/Addcustomer" element={<AddCustomerForm/>}/>
          <Route path="/ViewCustomer" element={<ViewCastumer/>} />
          <Route path="/AddPlan" element={<Addplan/>} />
          <Route path='/ViewPlan' element={<Viewplan/>} />
          <Route path="/Incentiveplan" element={<Incentiveplan/>} />
          <Route path="/ReceivedPayments" element={<Receivedpayments/>} />
          <Route path="/Unclearchequedetails" element={<Unclearcheque/>} />
          <Route path="/Addkhata" element={<Addkhata/>}/>
          <Route path="/Addkhasra" element={<Addkhasra/>}/>
          <Route path="/Viewkhata" element={<ViewKhata/>} />
          <Route path="/PaymentPage/:id" element={<PaymentPage/>}/>
          <Route path="/Viewkhasra" element={<Viewkhasra/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;

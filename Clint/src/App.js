import React from "react";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/login_component";
import SignUp from "./components/signup_component";
import UserDetails from "./components/userDetails";
import AdminDashboard from "./Home/AdminDashboard/AdminDashboard";
import UploadedProjects from "./Home/AdminDashboard/ShowProjects";
import ProjectDetails from "./Home/AdminDashboard/Uploads/ProjectDetails"; 
import Sidebar from "./Sidebar/Sidebar";

function App() {
  const isLoggedIn = window.localStorage.getItem("loggedIn");
  
  return (
    <Router>
      <div className="App">
        {isLoggedIn === "true" && <Sidebar />}
        <Routes>
          <Route
            exact
            path="/"
            element={isLoggedIn === "true" ? <UserDetails /> : <Login />}
          />
          <Route path="/sign-in" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/userDetails" element={<UserDetails />} />
          <Route path="/AdminDashboard" element={<AdminDashboard />} />
          <Route path="/uploaded-projects" element={<UploadedProjects />} />
          <Route path="/project/:projectId" element={<ProjectDetails />} /> 
        </Routes>
        {/* <ImageUpload/> */}
      </div>
    </Router>
  );
}

export default App;

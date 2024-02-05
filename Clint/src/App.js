import React from "react";
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
import User from "./User/User";
import Projects from "./UpdateProjects/Projects";
import Reports from "./components/Reports/Reports";

function App() {
  const isLoggedIn = window.localStorage.getItem("loggedIn");

  return (
    <Router>
      <div className="App">
        {isLoggedIn === "true" && (
          <Routes>
          <Route path="/" element={<Navigate to="/userDetails" />} />
          <Route path="/userDetails" element={<Sidebar />} />
          <Route path="/AdminDashboard/*" element={<Sidebar />} />
          <Route path="/uploaded-projects" element={<Sidebar />} />
          <Route path="/project/:projectId" element={<Sidebar />} />
          <Route path="/user" element={<Sidebar/>} />
          <Route path="/Projects" element={<Sidebar />} />
          <Route path="/Reports" element={<Sidebar />} />
          </Routes>
        )}
        <Routes>
          <Route path="/" element={isLoggedIn === "true" ? <UserDetails /> : <Login />} />
          <Route path="/sign-in" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/userDetails" element={<UserDetails />} />
          <Route path="/AdminDashboard" element={<AdminDashboard />} />
          <Route path="/uploaded-projects" element={<UploadedProjects />} />
          <Route path="/project/:projectId" element={<ProjectDetails />} />
          <Route path="/user" element={<User />} />
          <Route path="/Projects" element={<Projects />} />
          <Route path="/Reports" element={<Reports />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

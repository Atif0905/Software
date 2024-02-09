import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from '../Sidebar/Sidebar';
import Projects from '../UpdateProjects/Projects';
import User from '../User/User';
import AdminDashboard from '../Home/AdminDashboard/AdminDashboard';
import UploadedProjects from '../Home/AdminDashboard/ShowProjects';
import ProjectDetails from '../Home/AdminDashboard/Uploads/ProjectDetails';
const AdminApp = () => {
  return (
          <div className='' >            
            <Routes>
            <Route path="/AdminDashboard" element={<AdminDashboard />} />
            <Route path="/Projects" element={<Projects />}/>
            <Route path="/uploaded-projects" element={<UploadedProjects />} />
            <Route path="/project/:projectId" element={<ProjectDetails />} />
            <Route path="/user" element={<User />} />
            <Route path="/Projects" element={<Projects />} />
            </Routes>
            </div>
  )
}

export default AdminApp
import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import UserSidebar from '../Sidebar/UserSidebar'
import UserDashBoard from '../Home/UserDashboard/UserDashBoard';
import UserProjects from '../Home/UserDashboard/UserProjects';
const UserApp = () => {
  return (
    <div>
        <UserSidebar />
        <Router>
            <Routes >
                <Route path='/dashboard' element={<UserDashBoard/>}/>
                <Route path='/Userproject' element={<UserProjects/>}/>
            </Routes>
        </Router>
    </div>
  )
}

export default UserApp
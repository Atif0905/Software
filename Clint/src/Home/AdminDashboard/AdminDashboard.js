import React from 'react'
import AdminUploadProject from './Uploads/ProjectsUpload'
import UploadedProjects from './ShowProjects'
import './AdminDashboard.css'
const AdminDashboard = () => {
  return (
    <>
    <div className='main-content'>
    <h4 className='Headtext'>DashBoard</h4>
      <AdminUploadProject/>
      <UploadedProjects/>
    </div>
    </>
  )
}
export default AdminDashboard
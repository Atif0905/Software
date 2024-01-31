import React from 'react'
import AdminHome from '../../components/adminHome'
import AdminUploadProject from './Uploads/ProjectsUpload'
import UploadedProjects from './ShowProjects'

const AdminDashboard = () => {
  return (
    <div className='main-content'>
      <h1 className='mainhead'>Hello Admin</h1>
      <AdminHome/>
      <AdminUploadProject/>
      <UploadedProjects/>
    </div>
  )
}

export default AdminDashboard

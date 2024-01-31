import React from 'react'
import AdminHome from '../../components/adminHome'
import AdminUploadProject from './Uploads/ProjectsUpload'
import UploadedProjects from './ShowProjects'

const AdminDashboard = () => {
  return (
    <div>
      <h1>hii Admin</h1>
      <AdminHome/>
      <AdminUploadProject/>
      <UploadedProjects/>
    </div>
  )
}

export default AdminDashboard

import React from 'react'
import AdminUploadProject from './Uploads/ProjectsUpload'
import UploadedProjects from './ShowProjects'
import './AdminDashboard.css'
import Copyright from '../../Confirmation/Copyright'
const AdminDashboard = () => {
  return (
    <>
    <main className='main-content'>
    <div className=''>
      <AdminUploadProject/>
      <UploadedProjects/>
      </div>
      <Copyright/>
    </main>
    </>
  )
}
export default AdminDashboard
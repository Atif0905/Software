import React from 'react'
import AdminUploadProject from './Uploads/ProjectsUpload'
import UploadedProjects from './ShowProjects'
import './AdminDashboard.css'
import Sidebar from '../../Sidebar/Sidebar'
import Copyright from '../../Confirmation/Copyright'
const AdminDashboard = () => {
  return (
    <>
    <Sidebar/>
    <main className='main-content'>
    <div className='mt-5'>
      <AdminUploadProject/>
      <UploadedProjects/>
      <Copyright/>
      </div>
    </main>
    </>
  )
}
export default AdminDashboard
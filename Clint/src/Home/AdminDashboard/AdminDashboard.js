import React from 'react'
import AdminUploadProject from './Uploads/ProjectsUpload'
import UploadedProjects from './ShowProjects'
import './AdminDashboard.css'
import Sidebar from '../../Sidebar/Sidebar'
const AdminDashboard = () => {
  return (
    <>
    <Sidebar/>
    <main className='main-content'>
    <div className='mt-5'>
      <AdminUploadProject/>
      <UploadedProjects/>
      </div>
    </main>
    </>
  )
}
export default AdminDashboard
import React from 'react';
import AdminUploadProject from './Uploads/ProjectsUpload';
import './AdminDashboard.css';
const AdminDashboard = () => {
  return (
    <>
    <main className='main-content'>
    <div className=''>
      <AdminUploadProject/>
      </div>
    </main>
    </>
  )
}
export default AdminDashboard
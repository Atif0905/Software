import React from 'react'
// import AdminHome from '../../components/adminHome'
import AdminUploadProject from './Uploads/ProjectsUpload'
import UploadedProjects from './ShowProjects'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';

const AdminDashboard = () => {
  return (
    <>
    <h1 className='mainhead profilehead '><FontAwesomeIcon icon={faUser} className='mainico'/>Hello Admin</h1>
    <div className='main-content'>
      {/* <AdminHome/> */}
      <AdminUploadProject/>
      <UploadedProjects/>
    </div>
    </>
  )
}

export default AdminDashboard

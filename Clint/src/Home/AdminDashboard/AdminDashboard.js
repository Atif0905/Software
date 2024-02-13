import React from 'react'
import AdminUploadProject from './Uploads/ProjectsUpload'
import UploadedProjects from './ShowProjects'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import AddCustomerForm from "./Uploads/Coustmer"

import './AdminDashboard.css'
const AdminDashboard = () => {
  return (
    <>
    <div className='main-content'>
    <h2 className='profilehead'><FontAwesomeIcon icon={faUser} className='mainico'/>Hello A</h2>
      {/* <AdminHome/> */}
      <AdminUploadProject/>
      <UploadedProjects/>
    </div>
    </>
  )
}

export default AdminDashboard

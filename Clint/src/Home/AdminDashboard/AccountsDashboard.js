import React from 'react'
import AccountsSidebar from '../../Sidebar/AccountsSidebar'
import AdminUploadProject from './Uploads/ProjectsUpload'
import AccountsProjects from './AccountsProjects'
const AccountsDashboard = () => {
  return (
    <div className=''>
        <AccountsSidebar/>
        <div className='main-content'>
        <div className='mt-5'>
        <AdminUploadProject/>
        <AccountsProjects/>
        </div>
        </div>
        </div>
  )
}

export default AccountsDashboard
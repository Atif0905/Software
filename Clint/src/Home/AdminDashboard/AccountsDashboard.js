import React from 'react';
import AccountsSidebar from '../../Sidebar/AccountsSidebar';
import AdminUploadProject from './Uploads/ProjectsUpload';
import AccountsProjects from './AccountsProjects';
import Copyright from '../../Confirmation/Copyright';
const AccountsDashboard = () => (
  <>
    {/* <AccountsSidebar /> */}
    <main className='main-content'>
      <div className='mt-5'>
      <AdminUploadProject />
      <AccountsProjects />
      <Copyright/>
      </div>
      
    </main>
  </>
);
export default AccountsDashboard;
import React from 'react';
import AccountsSidebar from '../../Sidebar/AccountsSidebar';
import AdminUploadProject from './Uploads/ProjectsUpload';
import AccountsProjects from './AccountsProjects';
const AccountsDashboard = () => (
  <>
    <AccountsSidebar />
    <main className='main-content'>
      <div className='mt-5'>
      <AdminUploadProject />
      <AccountsProjects />
      </div>
    </main>
  </>
);
export default AccountsDashboard;
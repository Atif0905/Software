import React, { useState } from 'react';
import DueDateModal from '../Reminder/DueDateModal';
import Request from '../Reminder/Request';

const Bell = () => {
  const [activeTab, setActiveTab] = useState('notifications');
  const activeBackgroundColor =
  activeTab === 'notifications' ? '#6F4F9B4A' : '#FAD1D58C';
  return (
    <div className="">
      <div className="notficationgrid">
        <button className={`notficationbutton ${ activeTab === "notifications" ? "active" : ""}`} onClick={() => setActiveTab('notifications')}>Notifications</button>
        <div className='midline' style={{ backgroundColor: activeBackgroundColor }}></div>
        <button className={`requestbutton ${ activeTab === "requests" ? "active" : ""}`} onClick={() => setActiveTab('requests')}> Requests </button>
      </div>
      <div className='midline1' style={{ backgroundColor: activeBackgroundColor }}></div>
      <div className='mt-3'>{activeTab === 'notifications' && <DueDateModal />}</div>
      <div className='mt-3 data'>{activeTab === 'requests' && <Request />}</div>
    </div>
  );
};

export default Bell;

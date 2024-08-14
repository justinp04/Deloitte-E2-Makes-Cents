/************************************************************************************************
 * Purpose: Settings Page
 * Fix: - User guide font size changes
 ************************************************************************************************/
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import SettingsSidebar from '../settings-components/SettingsSidebar';
import AccountInfo from '../settings-components/AccountInfo';
import NotificationsSettings from '../settings-components/Notifications';
import UserGuide from '../settings-components/UserGuide';
import UpdateProfileInsights from '../settings-components/UpdateProfileInsights';
import './Settings.css';

function Settings({ isSignedIn }) {
  return (
    <div className="page-container">
      <div className="sidebar">
        <SettingsSidebar />
      </div>
      <div className="content">
        <div className="title-container">
          <h1 className="page-header ms-3">Settings</h1>
        </div>
        <Routes>
          <Route path="account-info" element={<AccountInfo />} />
          <Route path="update-profile" element={<UpdateProfileInsights />} />
          <Route path="notifications" element={<NotificationsSettings />} />
          <Route path="user-guide" element={<UserGuide />} />
        </Routes>
      </div>
    </div>
  );
}
export default Settings;


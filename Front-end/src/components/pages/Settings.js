/************************************************************************************************
 * Purpose: Settings Page
 * Fix: - User guide font size changes
 ************************************************************************************************/
import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import SettingsSidebar from '../settings-components/SettingsSidebar';
import AccountInfo from '../settings-components/AccountInfo';
import NotificationsSettings from '../settings-components/Notifications';
import UserGuide from '../settings-components/UserGuide';
import UpdateProfileInsights from '../settings-components/UpdateProfileInsights';
import '../pages/Settings.css';

function Settings() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Callback to toggle the sidebar state
    const openSidebar = (isOpen) => {
        setSidebarOpen(isOpen);
    };

    return (
        <div className={`page-container ${sidebarOpen ? 'sidebar-open' : ''}`}>
            <SettingsSidebar toggleSidebar={openSidebar} />
            <div className={`content ${sidebarOpen ? 'shift-content' : ''}`}>
                <div className="title-container">
                    <h1 className="page-header ms-3 align-self-start">Settings</h1>
                </div>
                <div className="ms-3">
                    <Routes>
                        <Route path="account-info" element={<AccountInfo />} />
                        <Route path="update-profile" element={<UpdateProfileInsights />} />
                        <Route path="notifications" element={<NotificationsSettings />} />
                        <Route path="user-guide" element={<UserGuide />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
}

export default Settings;







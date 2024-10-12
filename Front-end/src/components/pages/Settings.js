/************************************************************************************************
 * Purpose: Settings Page
 * Fix: - User guide font size changes
 ************************************************************************************************/
import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import SettingsSidebar from '../settings-components/SettingsSidebar';
import AccountInfo from '../settings-components/AccountInfo';
import UserGuide from '../settings-components/UserGuide';
import UpdateProfileInsights from '../settings-components/UpdateProfileInsights';
import '../pages/Settings.css';
import SettingsTitle from '../settings-components/SettingsTitle';

function Settings() {
     // Get the current path to determine which page is active
     const location = useLocation();

    // Define the page titles for each path
    const getPageDetails = () => {
        switch (location.pathname) {
            case '/settings/account-info':
                return {
                    title: 'Account Information',
                    infoText: 'Update your account information.'
                };
            case '/settings/update-profile':
                return {
                    title: 'Update Profile Insights',
                    infoText: 'To provide you with the most relevant stock recommendations, please fill out the "Profile Insights" section. This information will help us tailor our suggestions to match your investment experience, financial goals, and risk tolerance.'
                };
            case '/settings/user-guide':
                return {
                    title: 'User Guide',
                    infoText: 'Refer to the user guide for step-by-step instructions on how to use the platform.'
                };
            default:
                return {
                    title: 'Settings',
                    infoText: 'Select an option from the sidebar to begin editing your settings.'
                };
        }
    };

    const { title, infoText } = getPageDetails(); // Extract title and information text


    return (
        <div className="page-container">
            <div className="sidebar-button" style={{ zIndex: 1000 }}>
                <SettingsSidebar/>
            </div>
            <div className="content content-margining pt-0">
            <SettingsTitle textContent={title} pageInformationText={infoText} />
                <Routes>
                    <Route path="account-info" element={<AccountInfo />} />
                    <Route path="update-profile" element={<UpdateProfileInsights />} />
                    <Route path="user-guide" element={<UserGuide />} />
                </Routes>
            </div>
        </div>
    );
}

export default Settings;






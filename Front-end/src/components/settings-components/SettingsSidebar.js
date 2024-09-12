/************************************************************************************************
 * Purpose: Sidebar for Settings Page
 * Fix:
 *  - Colour
 ************************************************************************************************/
import React from 'react';
import { Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

import SearchBar from '../SearchBar';

const SettingsSidebar = () => {
    return (
        <div className="mt-4">
            <SearchBar placeholder="Search Settings" />
            <Nav className="flex-column mt-3">
                <Nav.Item className="d-flex">
                    <NavLink 
                        to="account-info" 
                        className="menu-selection fw-bold" 
                        style={{ width: "100%", height:"3rem", paddingLeft: "20px", display: "flex", alignItems: "center" }}
                        activeClassName="active"
                    >
                        Account Information
                    </NavLink>
                </Nav.Item>
                <Nav.Item className="d-flex">
                    <NavLink 
                        to="update-profile" 
                        className="menu-selection fw-bold" 
                        style={{ width: "100%", height:"3rem", paddingLeft: "20px", display: "flex", alignItems: "center" }}
                        activeClassName="active"
                    >
                        Update Profile Insights
                    </NavLink>
                </Nav.Item>
                <Nav.Item className="d-flex">
                    <NavLink 
                        to="notifications" 
                        className="menu-selection fw-bold" 
                        style={{ width: "100%", height:"3rem", paddingLeft: "20px", display: "flex", alignItems: "center" }}
                        activeClassName="active"
                    >
                        Notification Preferences
                    </NavLink>
                </Nav.Item>
                <Nav.Item className="d-flex">
                    <NavLink 
                        to="user-guide" 
                        className="menu-selection fw-bold" 
                        style={{ width: "100%", height:"3rem", paddingLeft: "20px", display: "flex", alignItems: "center" }}
                        activeClassName="active"
                    >
                        User Guide
                    </NavLink>
                </Nav.Item>
            </Nav>
        </div>
    );
};

export default SettingsSidebar;







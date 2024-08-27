/************************************************************************************************
 * Purpose: Sidebar for Settings Page
 * Fix:
 *  - Colour
 ************************************************************************************************/
import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import SearchBar from '../SearchBar';

const SettingsSidebar = () => {
    return (
        <div className="p-3 mt-4">
            <SearchBar placeholder="Search Settings" />
            <Nav className="flex-column">
                <Nav.Item>
                    <Nav.Link as={Link} to="account-info" className="nav-link fw-bold">Account Information</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link as={Link} to="update-profile" className="nav-link fw-bold">Update Profile Insights</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link as={Link} to="notifications" className="nav-link fw-bold">Notification Preferences</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link as={Link} to="user-guide" className="nav-link fw-bold">User Guide</Nav.Link>
                </Nav.Item>
            </Nav>
        </div>
    );
}
export default SettingsSidebar;



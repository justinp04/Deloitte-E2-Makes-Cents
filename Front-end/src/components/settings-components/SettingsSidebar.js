/************************************************************************************************
 * Purpose: Sidebar for Settings Page
 * Fix:
 *  - Colour
 ************************************************************************************************/

import React, { useState } from 'react';
import { Nav, Button, Offcanvas } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import SearchBar from '../SearchBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import '../Components.css';

const SettingsSidebar = ({ toggleSidebar }) => {
    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false);
        toggleSidebar(false); // Notify parent that the sidebar is closed
    };

    const handleShow = () => {
        setShow(true);
        toggleSidebar(true); // Notify parent that the sidebar is open
    };

    return (
        <>
            {/* Sidebar Toggle Button */}
            <Button
                variant="light"
                className="d-lg-none position-fixed"
                style={{marginTop:"85px", border:"none", background:"white", outline:"none"}}
                onClick={handleShow}
            >
                <FontAwesomeIcon icon={faBars} />
            </Button>

            {/* Offcanvas Sidebar */}
            <Offcanvas
                show={show}
                onHide={handleClose}
                responsive="lg"
                className="p-0"
                style={{ width: '300px' }}
            >
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Settings</Offcanvas.Title>
                </Offcanvas.Header>

                {/* Adjust the margin-top based on the collapsed state */}
                <Offcanvas.Body className="p-0">
                    <Nav
                        className="flex-column"
                        style={{ marginTop: show ? '0px' : '73px' }} // 80px when not collapsed
                    >
                        {/* <SearchBar placeholder="Search Settings" className="mb-3"/> */}
                        <div className="fixed-searchbar">
                            <SearchBar placeholder="Search Settings" className="mb-0"/>
                        </div>
                        
                        <Nav.Item className="d-flex mt-2">
                            <NavLink
                                to="account-info"
                                className="menu-selection fw-bold"
                                activeClassName="active"
                            >
                                Account Information
                            </NavLink>
                        </Nav.Item>
                        <Nav.Item className="d-flex">
                            <NavLink
                                to="update-profile"
                                className="menu-selection fw-bold"
                                activeClassName="active"
                            >
                                Update Profile Insights
                            </NavLink>
                        </Nav.Item>
                        <Nav.Item className="d-flex">
                            <NavLink
                                to="user-guide"
                                className="menu-selection fw-bold"
                                activeClassName="active"
                            >
                                User Guide
                            </NavLink>
                        </Nav.Item>
                    </Nav>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
};

export default SettingsSidebar;

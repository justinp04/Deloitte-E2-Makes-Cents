/************************************************************************************************
 * Purpose: Sidebar for Settings Page
 * Fix:
 *  - Colour
 ************************************************************************************************/
import React, { useState } from 'react';
import { Nav, Button, Offcanvas, Container } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import SearchBar from '../SearchBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import '../Components.css';

const SettingsSidebar = ({ toggleSidebar }) => {
    const [showSidebar, setShowSidebar] = useState(false); // Controls Offcanvas visibility
    // Handle closing the sidebar
    const handleCloseSidebar = () => setShowSidebar(false);

    // Handle opening the sidebar
    const handleShowSidebar = () => setShowSidebar(true);

    return (
        <div className="position-fixed">
            {/* Sidebar Toggle Button */}
            <Button
                variant="light"
                className="d-lg-none position-fixed"
                style={{border:"none", background:"white", outline:"none"}}
                onClick={handleShowSidebar}>
                <FontAwesomeIcon icon={faBars} />
            </Button>

            {/* Offcanvas Sidebar */}
            <Offcanvas
                show={showSidebar}
                onHide={handleCloseSidebar}
                responsive="lg"
                className="p-0"
                style={{ width: '300px' }}
            >
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title className='fw-bold'>Settings</Offcanvas.Title>
                </Offcanvas.Header>

                {/* Adjust the margin-top based on the collapsed state */}
                <Offcanvas.Body className="p-0 sidebar-background-colour">
                    <Container className="p-0 sidebar-background-colour">
                        <div className="fixed-searchbar pt-2 pb-3" style={{backgroundColor:"white"}}>
                            <SearchBar placeholder="Search Settings" className="mb-0"/>
                        </div>

                        <Nav
                            className="flex-column"
                        >              
                            <Nav.Item className="d-flex">
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
                    </Container>
                </Offcanvas.Body>
            </Offcanvas>
        </div>
    );
};

export default SettingsSidebar;

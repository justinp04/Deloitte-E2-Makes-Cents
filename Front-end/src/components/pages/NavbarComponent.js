
/************************************************************************************************
 * Purpose: Navigation Bar
 * Fix: 
 *  - Remove sign out button and add to profile/settings
 ************************************************************************************************/

import React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Nav, Navbar, Container, Dropdown } from 'react-bootstrap';
import {SignOutButton} from "../../authentication/SignOutButton";
import {SignInButton} from "../../authentication/SignInButton";
import {useIsAuthenticated} from "@azure/msal-react";

import './NavbarComponent.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';

function NavbarComponent() 
{
    const [aboutPageState, setAboutPageState] = useState(true);
    const navigate = useNavigate();
    const isAuthenticated = useIsAuthenticated();

    return (
        <Navbar expand="lg" fixed="top" className="navbar-light navbar-gradient">
            <Container fluid className="me-2 ms-3">
                {/* Site Logo Name */}
                <Navbar.Brand as={Link} to="/" className="site-title fw-bold { x % y == 0 ? 'purple' : 'not-purple'}" hidden={aboutPageState ? "true" : "false"}>
                    Makes Cents
                </Navbar.Brand>
                {/* Allows for hamburger style menu when display size is changed */}
                <Navbar.Toggle aria-controls="navbarNav" />
                <Navbar.Collapse id="navbarNav ma-3" style={{backgroundColor:"white"} }>
                    <Nav className="ms-auto align-items-center">
                         {/* About Us link */}
                        <Nav.Link as={Link} to="/about" className="fw-bold me-3 ms-3">
                            About Us
                        </Nav.Link>
                        {/* Links only shown when a user is signed in */}
                        {isAuthenticated ? (
                            <>
                                {/* Stock Analysis link */}
                                <Nav.Link as={Link} to="/stock-analysis" className="fw-bold me-3 ms-3">
                                    Stock Analysis
                                </Nav.Link>
                                {/* News Feed link */}
                                <Nav.Link as={Link} to="/news-feed" className="fw-bold me-3 ms-3">
                                    News Feed
                                </Nav.Link>
                                {/* Notifications link */}
                                <Dropdown align="end" className="me-3 ms-3">
                                    <Dropdown.Toggle aa={Nav.Link} className='fw-bold p-0' style={{ border: 'none', backgroundColor: 'transparent' }}>
                                        <FontAwesomeIcon icon={faBell} size="xl" style={{ color: '#555' }} />
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item>Notification 1</Dropdown.Item>
                                        <Dropdown.Item>Notification 2</Dropdown.Item>
                                        <Dropdown.Item>Notification 3</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                                {/* Settings link */}
                                <Dropdown align="end" className="me-3 ms-3">
                                    <Dropdown.Toggle aa={Nav.Link} className='fw-bold p-0' style={{ border: 'none', backgroundColor: 'transparent' }}>
                                        <img src="./images/UserProfile.jpg" alt="Profile" className="rounded-circle" width="60" height="60" />
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item as={Link} to="/settings/account-info">Account Information</Dropdown.Item>
                                        <Dropdown.Item as={Link} to="/settings/update-profile">Update Profile Insights</Dropdown.Item>
                                        <Dropdown.Item as={Link} to="/settings/notifications">Notifications Settings</Dropdown.Item>
                                        <Dropdown.Item as={Link} to="/settings/user-guide">User Guide</Dropdown.Item>
                                        <Dropdown.Item>Sign Out</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                                <SignOutButton/>
                            </>
                        ) : (
                            <SignInButton/>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavbarComponent;
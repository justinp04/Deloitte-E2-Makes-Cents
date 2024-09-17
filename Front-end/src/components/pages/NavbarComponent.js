
/************************************************************************************************
 * Purpose: Navigation Bar
 * Fix: 
 *  - Remove sign out button and add to profile/settings
 ************************************************************************************************/

import React from 'react';
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Nav, Navbar, Container, Dropdown } from 'react-bootstrap';
import {SignOutButton} from "../../authentication/SignOutButton";
import {SignInButton} from "../../authentication/SignInButton";
import {useIsAuthenticated} from "@azure/msal-react";

import './NavbarComponent.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faBars, faCircleUser, faIdBadge, faBookOpen  } from '@fortawesome/free-solid-svg-icons';

function NavbarComponent() 
{
    const [showTitleState, setTitleState] = useState(false);
    const navigate = useNavigate();
    const isAuthenticated = useIsAuthenticated();

    const location = useLocation();

    useEffect(() => {
        if (location.pathname.includes("stock-analysis") || location.pathname.includes("news-feed")) {
            setTitleState(false);
        } else {
            setTitleState(true);
        }
    }, [location.pathname]); // Add location.pathname to dependencies
    

    return (
        <Navbar expand="lg" fixed="top" className="navbar-light">
            <Container fluid className="me-2 ms-3">
                {/* Site Logo Name */}
                <Navbar.Brand as={Link} to="/" className="site-title fw-bold" hidden={showTitleState}>
                    Makes Cents
                </Navbar.Brand>

                {/* Allows for hamburger style menu when display size is changed */}
                <Navbar.Toggle className="ms-auto" style={{border:"none"}}>
                    <FontAwesomeIcon icon={faBars} />
                </Navbar.Toggle>
                
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
                                        <img src="../images/UserProfile.jpg" alt="Profile" className="rounded-circle" width="60" height="60" />
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        {/* <Dropdown.Header className='fw-bold'>Settings Preferences</Dropdown.Header> */}
                                        {/* Account Information with Icon */}
                                        <Dropdown.Item as={Link} to="/settings/account-info" className='my-2'>
                                            <div className="d-flex align-items-center">
                                                <FontAwesomeIcon icon={faCircleUser} className="me-2" />
                                                Account Information
                                            </div>
                                        </Dropdown.Item>

                                        {/* Update Profile Insights with Icon */}
                                        <Dropdown.Item as={Link} to="/settings/update-profile" className='my-2'>
                                            <div className="d-flex align-items-center">
                                                <FontAwesomeIcon icon={faIdBadge} className="me-2" />
                                                Update Profile Insights
                                            </div>
                                        </Dropdown.Item>

                                        {/* Notifications Settings with Icon */}
                                        <Dropdown.Item as={Link} to="/settings/notifications" className='my-2'>
                                            <div className="d-flex align-items-center">
                                                <FontAwesomeIcon icon={faBell} className="me-2" />
                                                Notifications Settings
                                            </div>
                                        </Dropdown.Item>

                                        {/* User Guide with Icon */}
                                        <Dropdown.Item as={Link} to="/settings/user-guide" className='my-2'>
                                            <div className="d-flex align-items-center">
                                                <FontAwesomeIcon icon={faBookOpen} className="me-2" />
                                                User Guide
                                            </div>
                                        </Dropdown.Item>
                                        <div className="d-flex justify-content-center my-2">
                                            <SignOutButton />
                                        </div>
                                    </Dropdown.Menu>
                                </Dropdown>
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
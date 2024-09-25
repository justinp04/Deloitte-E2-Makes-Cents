
/************************************************************************************************
 * Purpose: Navigation Bar
 * Fix: 
 ************************************************************************************************/

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Nav, Navbar, Container, Dropdown } from 'react-bootstrap';
import { SignOutButton } from "../../authentication/SignOutButton";
import { SignInButton } from "../../authentication/SignInButton";
import { useIsAuthenticated } from "@azure/msal-react";
import './NavbarComponent.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faBars, faCircleUser, faIdBadge, faBookOpen } from '@fortawesome/free-solid-svg-icons';

function NavbarComponent() {
    const [showTitleState, setTitleState] = useState(false);
    const isAuthenticated = useIsAuthenticated();
    const location = useLocation(); // Get the current location

    useEffect(() => {
        if (location.pathname.includes("stock-analysis") || location.pathname.includes("news-feed") || location.pathname.includes("settings") ) {
            setTitleState(false);
        } 
        else {
            setTitleState(true);
        }
    }, [location.pathname]);

    // Function to check if the current link is active
    const isActive = (path) => location.pathname === path;

    return (
        <Navbar expand="lg" fixed="top" className="navbar-light">
            <Container fluid className="me-2 ms-3">
                <Navbar.Brand as={Link} to="/" className="site-title fw-bold" hidden={showTitleState}>
                    <img src="../images/MCLogo.png" width="30" height="30" className='mb-2 me-2'/>
                    Makes Cents
                </Navbar.Brand>

                <Navbar.Toggle className="ms-auto" style={{ border: "none" }}>
                    <FontAwesomeIcon icon={faBars} />
                </Navbar.Toggle>

                <Navbar.Collapse id="navbarNav ma-3" style={{ backgroundColor: "white" }}>
                    <Nav className="ms-auto align-items-center">
                        <Nav.Link
                            as={Link}
                            to="/about"
                            className={`fw-bold me-3 ms-3 ${isActive("/about") ? "active-link" : ""}`}
                        >
                            About Us
                        </Nav.Link>

                        {isAuthenticated ? (
                            <>
                                <Nav.Link
                                    as={Link}
                                    to="/stock-analysis"
                                    className={`fw-bold me-3 ms-3 ${isActive("/stock-analysis") ? "active-link" : ""}`}
                                >
                                    Stock Analysis
                                </Nav.Link>

                                <Nav.Link
                                    as={Link}
                                    to="/news-feed"
                                    className={`fw-bold me-3 ms-3 ${isActive("/news-feed") ? "active-link" : ""}`}
                                >
                                    News Feed
                                </Nav.Link>

                                <Dropdown align="end" className="me-3 ms-3">
                                    <Dropdown.Toggle as={Nav.Link} className="fw-bold p-0 no-caret" style={{ border: 'none', backgroundColor: 'transparent' }}>
                                        <img src="../images/UserProfile.jpg" alt="Profile" className="rounded-circle" width="55" height="55" />
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item as={Link} to="/settings/account-info" className="my-2">
                                            <div className="d-flex align-items-center">
                                                <FontAwesomeIcon icon={faCircleUser} className="me-2" />
                                                Account Information
                                            </div>
                                        </Dropdown.Item>
                                        <Dropdown.Item as={Link} to="/settings/update-profile" className="my-2">
                                            <div className="d-flex align-items-center">
                                                <FontAwesomeIcon icon={faIdBadge} className="me-2" />
                                                Update Profile Insights
                                            </div>
                                        </Dropdown.Item>
                                        <Dropdown.Item as={Link} to="/settings/user-guide" className="my-2">
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
                            <SignInButton />
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavbarComponent;

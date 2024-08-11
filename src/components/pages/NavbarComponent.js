
/************************************************************************************************
 * Purpose: Navigation Bar
 * Fix: 
 *  - Remove sign out button and add to profile/settings
 ************************************************************************************************/

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Nav, Navbar, Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import {SignOutButton} from "../../authentication/SignOutButton";
import {SignInButton} from "../../authentication/SignInButton";
import {useIsAuthenticated} from "@azure/msal-react";

function NavbarComponent({ isSignedIn, setIsSignedIn }) {
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();

  const handleSignOut = () => {
    setIsSignedIn(false);
    navigate('/about'); 
  };

  return (
    <Navbar bg="light" expand="lg" fixed="top" className="navbar-light">
      <Container fluid className="me-2 ms-3">
        <Navbar.Brand as={Link} to="/" className="site-title">
          Makes Cents
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarNav" />
        <Navbar.Collapse id="navbarNav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link as={Link} to="/about" className="fw-bold me-3 ms-3">
              About Us
            </Nav.Link>
            {isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/stock-analysis" className="fw-bold me-3 ms-3">
                  Stock Analysis
                </Nav.Link>
                <Nav.Link as={Link} to="/news-feed" className="fw-bold me-3 ms-3">
                  News Feed
                </Nav.Link>
                <Nav.Link as={Link} to="/notifications" className="fw-bold me-3 ms-3">
                  <FontAwesomeIcon icon={faBell} size="xl" />
                </Nav.Link>
                <Nav.Link as={Link} to="/settings" className="fw-bold me-3 ms-3">
                  <img src="./images/UserProfile.jpg" alt="Profile" className="rounded-circle" width="60" height="60" />
                </Nav.Link>
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




/************************************************************************************************
 * Purpose: Navigation Bar
 * Fix: 
 *  - Remove sign out button and add to profile/settings
 ************************************************************************************************/

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Nav, Navbar, Container, Dropdown } from 'react-bootstrap';

import './NavbarComponent.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';

function NavbarComponent({ isSignedIn, setIsSignedIn }) {
  const navigate = useNavigate();

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
            {isSignedIn ? (
              <>
                <Nav.Link as={Link} to="/stock-analysis" className="fw-bold me-3 ms-3">
                  Stock Analysis
                </Nav.Link>
                <Nav.Link as={Link} to="/news-feed" className="fw-bold me-3 ms-3">
                  News Feed
                </Nav.Link>
                {/* <Nav.Link as={Link} to="/notifications" className="fw-bold me-3 ms-3">
                  <FontAwesomeIcon icon={faBell} size="xl" />
                </Nav.Link> */}
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
                {/* <Nav.Link as={Link} to="/settings" className="fw-bold me-3 ms-3">
                  <img src="./images/UserProfile.jpg" alt="Profile" className="rounded-circle" width="60" height="60" />
                </Nav.Link> */}
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
                <Nav.Link
                  as="button"
                  className="btn btn-link nav-link fw-bold me-3 ms-3"
                  onClick={handleSignOut}
                >
                  Sign Out
                </Nav.Link>
              </>
            ) : (
              <Nav.Link as={Link} to="/signin" className="fw-bold">
                <button style={{ width:120 }} className="green-btn ">Sign in  </button>
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;



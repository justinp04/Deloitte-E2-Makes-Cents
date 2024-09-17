/************************************************************************************************
 * Authors: Alyssha Kwok
 * Purpose: Sidebar on news feed page
 ************************************************************************************************/
import React, { useState } from 'react';
import { Dropdown, Nav, Accordion, Container, Button, Offcanvas } from 'react-bootstrap';
import { Link } from 'react-router-dom';

// Importing icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faChevronRight, faBars } from '@fortawesome/free-solid-svg-icons';

// Importing components and css
import SearchBar from '../SearchBar';
import '../pages/NewsFeed.css';

const NewsSidebar = ({ onSearch }) => {
    const [expandedItems, setExpandedItems] = useState({}); // Tracks open/close state of each accordion item
    const [showSidebar, setShowSidebar] = useState(false); // Controls Offcanvas visibility

    const handleToggleAccordion = (eventKey) => {
        setExpandedItems((prevState) => ({
            ...prevState,
            [eventKey]: !prevState[eventKey], // Toggle only the specific accordion item
        }));
    };

    const handleCloseSidebar = () => setShowSidebar(false);
    const handleShowSidebar = () => setShowSidebar(true);

    return (
        <>
            {/* Sidebar Toggle Button */}
            <Button
                variant="light"
                className="d-lg-none position-fixed"
                style={{ marginTop: "85px", border: "none", background: "white", outline: "none" }}
                onClick={handleShowSidebar}
            >
                <FontAwesomeIcon icon={faBars} />
            </Button>

            {/* Offcanvas Sidebar for News Feed */}
            <Offcanvas
                show={showSidebar}
                onHide={handleCloseSidebar}
                responsive="lg"
                className="p-0"
                style={{ width: '300px'}}
            >
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>News Feed</Offcanvas.Title>
                </Offcanvas.Header>

                <Offcanvas.Body className="p-0">
                    <Container fluid className="p-0" style={{ marginTop: showSidebar ? '0px' : '80px' }}>
                        <SearchBar placeholder="Search a stock" onSearch={onSearch} />
                        
                        {/* Accordion with individual open/close state for each item */}
                        <Accordion>
                            <Accordion.Item eventKey="0">
                                <Accordion.Header className="d-inline-flex justify-content-between align-items-centre w-100" onClick={() => handleToggleAccordion("0")}>
                                    <FontAwesomeIcon
                                        id="stockRecommendations"
                                        icon={faChevronRight}
                                        className={`chevron-icon ${expandedItems["0"] ? 'rotate' : ''}`} />
                                    <p className="my-0 ps-3 fw-bold">Current Investments</p>
                                </Accordion.Header>
                                {expandedItems["0"] && (
                                    <Accordion.Body className="ps-4 pe-1">
                                        Lorem ipsum dolor sit amet...
                                    </Accordion.Body>
                                )}
                            </Accordion.Item>

                            <Accordion.Item eventKey="1">
                                <Accordion.Header className="d-inline-flex justify-content-between align-items-centre w-100" onClick={() => handleToggleAccordion("1")}>
                                    <FontAwesomeIcon
                                        id="stockRecommendations"
                                        icon={faChevronRight}
                                        className={`chevron-icon ${expandedItems["1"] ? 'rotate' : ''}`} />
                                    <p className="my-0 ps-3 fw-bold">Following</p>
                                </Accordion.Header>
                                {expandedItems["1"] && (
                                    <Accordion.Body className="ps-4 pe-1">
                                        Lorem ipsum dolor sit amet...
                                    </Accordion.Body>
                                )}
                            </Accordion.Item>

                            <Accordion.Item eventKey="2">
                                <Accordion.Header className="d-inline-flex justify-content-between align-items-centre w-100" onClick={() => handleToggleAccordion("2")}>
                                    <FontAwesomeIcon
                                        id="NewsFeedSearch"
                                        icon={faChevronRight}
                                        className={`chevron-icon ${expandedItems["2"] ? 'rotate' : ''}`} />
                                    <p className="my-0 ps-3 fw-bold">Search Result</p>
                                </Accordion.Header>
                                {expandedItems["2"] && (
                                    <Accordion.Body className="ps-4 pe-1">
                                        Lorem ipsum dolor sit amet...
                                    </Accordion.Body>
                                )}
                            </Accordion.Item>
                        </Accordion>
                    </Container>

                    <Dropdown className="me-3 ms-3 add-button" style={{ border: 'none' }}>
                        <Dropdown.Toggle
                            as={Nav.Link}
                            className="fw-bold p-0 no-caret"
                            style={{ border: 'none', backgroundColor: 'transparent' }}>
                            <FontAwesomeIcon
                                icon={faPlus}
                                style={{
                                    height: '2rem',
                                    width: '2rem',
                                    color: 'white'
                                }}
                                className="align-items-center" />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item as={Link} to="">
                                Add new current investment
                            </Dropdown.Item>
                            <Dropdown.Item as={Link} to="">
                                Add new following
                            </Dropdown.Item>
                            <Dropdown.Item as={Link} to="">
                                Edit List
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
};

export default NewsSidebar;

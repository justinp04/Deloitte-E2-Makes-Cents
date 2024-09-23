/************************************************************************************************
 * Authors: Alyssha Kwok
 * Purpose: Sidebar on news feed page
 ************************************************************************************************/
import React, { useState } from 'react';
import { Accordion, Container, Button, Offcanvas } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faBars } from '@fortawesome/free-solid-svg-icons';
import SearchBar from '../SearchBar';
import '../pages/NewsFeed.css';
import AddButton from './AddButton';

const NewsSidebar = ({ onSearch }) => {
    const [expandedItems, setExpandedItems] = useState({}); // Tracks open/close state of each accordion item
    const [showSidebar, setShowSidebar] = useState(false); // Controls Offcanvas visibility

    // Toggle the accordion items and track their open/close state
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
                style={{ width: '300px' }}
            >
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>News Feed</Offcanvas.Title>
                </Offcanvas.Header>

                <Offcanvas.Body className="p-0">
                    <Container fluid className="p-0" style={{ marginTop: showSidebar ? '0px' : '80px' }}>
                        <SearchBar placeholder="Search a stock" onSearch={onSearch} />
                        
                        {/* Accordion with individual open/close state for each item */}
                        <Accordion defaultActiveKey={null} alwaysOpen>
                            {["0", "1", "2"].map((key, index) => (
                                <Accordion.Item eventKey={key} key={key}>
                                    <Accordion.Header
                                        className="d-inline-flex justify-content-between align-items-center w-100"
                                        onClick={() => handleToggleAccordion(key)} // Custom onClick for toggle
                                    >
                                        <FontAwesomeIcon
                                            id={`chevron-${key}`}
                                            icon={faChevronRight}
                                            className={`chevron-icon ${expandedItems[key] ? 'rotate' : ''}`} 
                                        />
                                        <p className="my-0 ps-3 fw-bold">
                                            {index === 0 ? 'Current Investments' : index === 1 ? 'Following' : 'Search Result'}
                                        </p>
                                    </Accordion.Header>
                                    {/* Show or hide based on expandedItems */}
                                    {expandedItems[key] && (
                                        <Accordion.Body className="ps-4 pe-1">
                                            Lorem ipsum dolor sit amet...
                                        </Accordion.Body>
                                    )}
                                </Accordion.Item>
                            ))}
                        </Accordion>
                    </Container>

                    {/* Add Button */}
                    <AddButton />
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
};

export default NewsSidebar;
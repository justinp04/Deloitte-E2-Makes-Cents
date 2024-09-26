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
import NewsSidebarCard from './NewsSidebarCard';

const NewsSidebar = ({ onSearch, currentInvestmentCompanies, followedCompanies }) => {
    const [expandedItems, setExpandedItems] = useState({}); // Tracks the open/close state of each accordion item
    const [showSidebar, setShowSidebar] = useState(false); // Controls Offcanvas visibility

    // Toggle the accordion items and track their open/close state
    const handleToggleAccordion = (eventKey) => {
        setExpandedItems((prevState) => ({
            ...prevState,
            [eventKey]: !prevState[eventKey], // Toggle only the specific accordion item
        }));
    };

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
                style={{border: "none", background: "none", outline: "none" }}
                onClick={handleShowSidebar}>
                <FontAwesomeIcon icon={faBars} />
            </Button>

            {/* Offcanvas Sidebar for News Feed */}
            <Offcanvas
                show={showSidebar}
                onHide={handleCloseSidebar}
                responsive="lg"
                className="p-0"
                style={{ width: '300px' }}>

                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>News Feed</Offcanvas.Title>
                </Offcanvas.Header>

                <Offcanvas.Body className="p-0 scrollable-sidebar sidebar-background-colour">
                    <Container fluid id="sidebarContainer" className="p-0 scrollable-sidebar sidebar-background-colour">
                        {/* Search bar for searching stocks */}
                        <div className="fixed-searchbar py-2" style={{backgroundColor:"white"}}>
                            <SearchBar placeholder="Search a stock" onSearch={onSearch} className="mb-0"/>
                        </div>

                        {/* Accordion with individual open/close state for each item */}
                        <Accordion defaultActiveKey={null} alwaysOpen className='mb-3 sidebar-background-colour'>
                            {["0", "1"].map((key, index) => (
                                <Accordion.Item eventKey={key} key={key} className='sidebar-background-colour'>
                                    <Accordion.Header
                                        className=" sidebar-background-colour pb-0 d-inline-flex justify-content-between align-items-center w-100"
                                        onClick={() => handleToggleAccordion(key)}
                                        style={{
                                            backgroundColor:"blue"
                                        }}
                                    >
                                        <FontAwesomeIcon
                                            id={`chevron-${key}`}
                                            icon={faChevronRight}
                                            className={`chevron-icon ${expandedItems[key] ? 'rotate' : ''}`}
                                        />
                                        <p className="my-0 ps-3 fw-bold">
                                            {index === 0 ? 'Current Investments' : 'Following'}
                                        </p>
                                    </Accordion.Header>
                                    {/* Show or hide based on expandedItems */}
                                    {expandedItems[key] && (
                                        <Accordion.Body>
                                            {index === 0 ? (
                                                // Create cards for current investment companies
                                                currentInvestmentCompanies.map((company) => (
                                                    <NewsSidebarCard
                                                        key={company.id}
                                                        companyTitle={company.companyTitle}
                                                        onClick={() => console.log(`Clicked on ${company.companyTitle}`)}
                                                        className="news-sidebar-card"/>
                                                ))
                                            ) : index === 1 ? (
                                                // Create cards for followed companies
                                                followedCompanies.map((company) => (
                                                    <NewsSidebarCard
                                                        key={company.id}
                                                        companyTitle={company.companyTitle}
                                                        onClick={() => console.log(`Clicked on ${company.companyTitle}`)}
                                                        className="news-sidebar-card"
                                                    />
                                                ))
                                            ) : null}
                                        </Accordion.Body>
                                    )}
                                </Accordion.Item>
                            ))}
                        </Accordion>
                    </Container>
                </Offcanvas.Body>
            </Offcanvas>
        </div>
    );
};

export default NewsSidebar;

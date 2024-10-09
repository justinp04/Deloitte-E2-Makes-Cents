import React, { useState, forwardRef } from 'react';
import { Accordion, Container, Button, Offcanvas } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faBars } from '@fortawesome/free-solid-svg-icons';
import SearchBar from '../SearchBar';
import '../pages/NewsFeed.css';
import NewsSidebarCard from './NewsSidebarCard';


const NewsSidebar = forwardRef (({ expandedItems, onToggle, onSearch, currentInvestmentCompanies, followedCompanies }, ref) => {
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
                style={{ border: "none", background: "none", outline: "none" }}
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
                        <div className="fixed-searchbar py-2" style={{ backgroundColor: "white" }}>
                            <SearchBar placeholder="Search a stock" onSearch={onSearch} className="mb-0" />
                        </div>

                        {/* Accordion controlled by expandedItems */}
                        <Accordion activeKey={expandedItems} alwaysOpen className='mb-3 sidebar-background-colour'>
                            {/* Current Investments Accordion Item */}
                            <Accordion.Item eventKey="currentInvestments" id = "curInvestments" ref = {ref} className='sidebar-background-colour'>
                                <Accordion.Header
                                    className="sidebar-background-colour pb-0 d-inline-flex justify-content-between align-items-center w-100"
                                    onClick={() => onToggle('currentInvestments')}
                                >
                                    <FontAwesomeIcon                                        
                                        //id={`chevron-currentInvestments`}
                                        id = "chevron-currentInvestments"
                                        icon={faChevronRight}
                                        className={`chevron-icon ${expandedItems.includes('currentInvestments') ? 'rotate' : ''}`}
                                    />
                                    <p className="my-0 ps-3 fw-bold">Current Investments</p>
                                </Accordion.Header>
                                <Accordion.Body>
                                    {currentInvestmentCompanies.map((company) => (
                                        <NewsSidebarCard
                                            key={company.id}
                                            companyTitle={company.companyTitle}
                                            onClick={() => console.log(`Clicked on ${company.companyTitle}`)}
                                            className="news-sidebar-card"
                                        />
                                    ))}
                                </Accordion.Body>
                            </Accordion.Item>

                            {/* Followed Companies Accordion Item */}
                            <Accordion.Item eventKey="followedCompanies" className='sidebar-background-colour'>
                                <Accordion.Header
                                    className="sidebar-background-colour pb-0 d-inline-flex justify-content-between align-items-center w-100"
                                    onClick={() => onToggle('followedCompanies')}
                                >
                                    <FontAwesomeIcon
                                        id={`chevron-followedCompanies`}
                                        icon={faChevronRight}
                                        className={`chevron-icon ${expandedItems.includes('followedCompanies') ? 'rotate' : ''}`}
                                    />
                                    <p className="my-0 ps-3 fw-bold">Following</p>
                                </Accordion.Header>
                                <Accordion.Body>
                                    {followedCompanies.map((company) => (
                                        <NewsSidebarCard
                                            key={company.id}
                                            companyTitle={company.companyTitle}
                                            onClick={() => console.log(`Clicked on ${company.companyTitle}`)}
                                            className="news-sidebar-card"
                                        />
                                    ))}
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </Container>
                </Offcanvas.Body>
            </Offcanvas>
        </div>
    );
});

export default NewsSidebar;

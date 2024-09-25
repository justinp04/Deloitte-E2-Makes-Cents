/************************************************************************************************
 * Authors: Alyssha Kwok
 * Purpose: Sidebar on news feed page
 ************************************************************************************************/
import React, { useState, useEffect } from 'react';
import { Accordion, Container, Button, Offcanvas } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faBars } from '@fortawesome/free-solid-svg-icons';
import SearchBar from '../SearchBar';
import '../pages/NewsFeed.css';
import AddButton from './AddButton';
import NewsSidebarCard from './NewsSidebarCard'

const NewsSidebar = ({ onSearch }) => {
    
    const [expandedItems, setExpandedItems] = useState({}); // Tracks open/close state of each accordion item
    const [showSidebar, setShowSidebar] = useState(false); // Controls Offcanvas visibility

    // Need to connect to sql database
    // Mock database of followed companies
    const currentInvestmentCompanies = [
        { id: 1, companyTitle: 'WOOLWORTHS GROUP LIMITED (WOW)' },
        { id: 2, companyTitle: 'BHP Group Ltd (BHP)' },
        { id: 3, companyTitle: 'Adairs (ADH)' },
        { id: 4, companyTitle: 'COLES GROUP LIMITED (COL)' },
        { id: 5, companyTitle: 'APPLE (APL)' },
        { id: 6, companyTitle: 'BHP Group Ltd (BHP)' },
        { id: 7, companyTitle: 'Adairs (ADH)' },
        { id: 8, companyTitle: 'COLES GROUP LIMITED (COL)' },
        { id: 9, companyTitle: 'APPLE (APL)' },
    ];

     // Mock database of followed companies
     const followedCompanies = [
        { id: 1, companyTitle: 'WOOLWORTHS GROUP LIMITED (WOW)' },
        { id: 2, companyTitle: 'BHP Group Ltd (BHP)' },
        { id: 3, companyTitle: 'Adairs (ADH)' },
        { id: 4, companyTitle: 'COLES GROUP LIMITED (COL)' },
        { id: 5, companyTitle: 'WOOLWORTHS GROUP LIMITED (WOW)' },
        { id: 6, companyTitle: 'BHP Group Ltd (BHP)' },
        { id: 7, companyTitle: 'Adairs (ADH)' },
        { id: 8, companyTitle: 'COLES GROUP LIMITED (COL)' },
    ];

    // Toggle the accordion items and track their open/close state
    const handleToggleAccordion = (eventKey) => {
        setExpandedItems((prevState) => ({
            ...prevState,
            [eventKey]: !prevState[eventKey], // Toggle only the specific accordion item
        }));
    };

    useEffect(() => {
        const handleResize = () => {
            const currentExpandedKeys = Object.keys(expandedItems).filter(key => expandedItems[key]);
            currentExpandedKeys.forEach((key) => (handleToggleAccordion(key)));

            setExpandedItems((prev) => {
                // Logic to maintain state based on size, if necessary
                return { ...prev }; // Modify this if you want to adjust based on size
            });
        };
    
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [expandedItems]);

    const handleCloseSidebar = () => setShowSidebar(false);
    const handleShowSidebar = () => setShowSidebar(true);

    return (
        <div className="">
            {/* Sidebar Toggle Button */}
            <Button
                variant="light"
                className="d-lg-none position-fixed"
                style={{ marginTop: "80px", border: "none", background: "none", outline: "none" }}
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

                <Offcanvas.Body className="p-0 scrollable-sidebar">
                    <Container fluid id="sidebarContainer" className="p-0 scrollable-sidebar mb-5">
                        <SearchBar placeholder="Search a stock" onSearch={onSearch}/>
                        {/* Accordion with individual open/close state for each item */}
                        <Accordion defaultActiveKey={null} alwaysOpen className='mb-3'>
                            {["0", "1", "2"].map((key, index) => (
                                <Accordion.Item eventKey={key} key={key}>
                                    <Accordion.Header
                                        className=" pb-0 d-inline-flex justify-content-between align-items-center w-100"
                                        onClick={() => handleToggleAccordion(key)} >
                                        <FontAwesomeIcon
                                            id={`chevron-${key}`}
                                            icon={faChevronRight}
                                            className={`chevron-icon ${expandedItems[key] ? 'rotate' : ''}`} />
                                        <p className="my-0 ps-3 fw-bold">
                                            {index === 0 ? 'Current Investments' : index === 1 ? 'Following' : 'Search Result'}
                                        </p>
                                    </Accordion.Header>
                                    {/* Show or hide based on expandedItems */}
                                    {expandedItems[key] && (
                                        <Accordion.Body className="pe-1">
                                            {index === 0 ? (
                                                // Create cards for current investment companies
                                                currentInvestmentCompanies.map(company => (
                                                    <NewsSidebarCard
                                                        key={company.id}
                                                        companyTitle={company.companyTitle}
                                                        onClick={() => console.log(`Clicked on ${company.companyTitle}`)}
                                                        className="news-sidebar-card"/>
                                                ))
                                            ) : index === 1 ? (
                                                // Create cards for followed companies
                                                followedCompanies.map(company => (
                                                    <NewsSidebarCard
                                                        key={company.id}
                                                        companyTitle={company.companyTitle}
                                                        onClick={() => console.log(`Clicked on ${company.companyTitle}`)}
                                                    />
                                                ))
                                            ) : index === 2 ? (
                                                <div style={{ marginBottom: '50px' }}> 
                                                    <SearchBar placeholder="Search a stock" onSearch={onSearch} />
                                                </div>
                                            ) :  null}
                                        </Accordion.Body>
                                    )}

                                </Accordion.Item>
                            ))}
                        </Accordion>
                    </Container>
                    {/* Add Button to add companies to list*/}
                    <AddButton />
                </Offcanvas.Body>
            </Offcanvas>
        </div>
    );
};

export default NewsSidebar;
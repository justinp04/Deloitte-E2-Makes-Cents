/************************************************************************************************
 * Purpose: Sidebar for Stock Analysis(SA) Page
 * Fix:
 *  - Colour
 ************************************************************************************************/
import React, { useState } from 'react';
import { Accordion, Button, Offcanvas } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faBars } from '@fortawesome/free-solid-svg-icons';
import SearchBar from '../SearchBar';
import '../pages/StockAnalysis.css';
import SASidebarCard from './SASidebarCard';

const SASidebar = ({ favouriteStocks, addFavourite, removeFavourite, onSearch, onNavigate = () => {} }) => {
    const [openKeys, setOpenKeys] = useState([]); // Accordion control
    const [searchTerm, setSearchTerm] = useState('');
    const [showSidebar, setShowSidebar] = useState(false); // Offcanvas visibility
    const [expandedItem, setExpandedItem] = useState(false); // Expanded accordion item

    // Toggle accordion items
    const handleSelect = (eventKey) => {
        if (openKeys.includes(eventKey)) {
            setOpenKeys(openKeys.filter((key) => key !== eventKey));
        } else {
            setOpenKeys([...openKeys, eventKey]);
        }
    };

    // Handle accordion item expansion
    const handleToggle = (eventKey) => {
        setExpandedItem(expandedItem === eventKey ? null : eventKey);
    };

    // Handle stock search
    const handleSearch = () => {
        if (!searchTerm.trim()) {
            alert('Please enter a stock name to search.');
            return;
        }
        onSearch(searchTerm); // Trigger search in StockAnalysis.js
    };

    const handleCloseSidebar = () => setShowSidebar(false); // Close the Offcanvas sidebar
    const handleShowSidebar = () => setShowSidebar(true);   // Open the Offcanvas sidebar

    return (
        <>
            {/* Sidebar Toggle Button */}
            <Button
                variant="light"
                className="d-lg-none position-fixed"
                style={{ marginTop: '85px', border: 'none', background: 'white', outline: 'none' }}
                onClick={handleShowSidebar}
            >
                <FontAwesomeIcon icon={faBars} />
            </Button>

            {/* Offcanvas Sidebar for Stock Analysis */}
            <Offcanvas
                show={showSidebar}
                onHide={handleCloseSidebar}
                responsive="lg"
                className="p-0"
                style={{ width: '300px' }}
            >
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Stock Analysis</Offcanvas.Title>
                </Offcanvas.Header>

                <Offcanvas.Body className="p-0">
                    <Accordion
                        className="p-0"
                        style={{
                            marginTop: showSidebar ? '0px' : '85px', // Adjust top margin based on Offcanvas state
                            width: '300px',
                        }}
                        activeKey={openKeys}
                        onSelect={handleSelect}
                    >
                        {/* 'Stock Recommendations' accordion item */}
                        <Accordion.Item eventKey="0">
                            <Accordion.Header
                                className={`sidebar-item-header d-inline-flex justify-content-between align-items-centre w-100 ${expandedItem === '0' ? 'focus' : ''}`}
                                onClick={() => handleToggle('0')}
                            >
                                <FontAwesomeIcon
                                    id="stockRecommendations"
                                    icon={faChevronRight}
                                    className={`chevron-icon ${expandedItem === '0' ? 'rotate' : ''}`}
                                />
                                <p className="my-0 ps-3 fw-bold">Stock Recommendations</p>
                            </Accordion.Header>
                            <Accordion.Body className="p-0">
                                <SASidebarCard
                                    companyTitle="BEGA CHEESE LIMITED (BGA)"
                                    status="Analysing"
                                    onClick={() => onNavigate('Bega Cheese Limited')}
                                    onFavourite={addFavourite}
                                />
                                <SASidebarCard
                                    companyTitle="WOOLWORTHS GROUP LIMITED (WOW)"
                                    status="Analysed"
                                    onClick={() => onNavigate('Woolworths Group Limited')}
                                    onFavourite={addFavourite}
                                />
                                <SASidebarCard
                                    companyTitle="COLES GROUP LIMITED (COL)"
                                    status="Analyse"
                                    onClick={() => onNavigate('Coles Group Limited')}
                                    onFavourite={addFavourite}
                                />
                            </Accordion.Body>
                        </Accordion.Item>

                        {/* 'Favourites' accordion item */}
                        <Accordion.Item eventKey="2">
                            <Accordion.Header
                                className={`d-inline-flex justify-content-between align-items-centre w-100 ${expandedItem === '2' ? 'focus' : ''}`}
                                onClick={() => handleToggle('2')}
                            >
                                <FontAwesomeIcon
                                    id="favourites"
                                    icon={faChevronRight}
                                    className={`chevron-icon ${expandedItem === '2' ? 'rotate' : ''}`}
                                />
                                <p className="my-0 ps-3 fw-bold">Favourites</p>
                            </Accordion.Header>
                            <Accordion.Body className="px-0 pt-1 pb-2">
                                <SearchBar placeholder="Search your saved stocks" />
                                {favouriteStocks.map((stock) => (
                                    <SASidebarCard
                                        key={stock.id}
                                        companyTitle={stock.title}
                                        status="Analyse"
                                        onClick={() => onNavigate(stock.title)}
                                    />
                                ))}
                            </Accordion.Body>
                        </Accordion.Item>

                        {/* 'Search Result' accordion item */}
                        <Accordion.Item eventKey="3">
                            <Accordion.Header
                                className={`d-inline-flex justify-content-between align-items-centre w-100 ${expandedItem === '3' ? 'focus' : ''}`}
                                onClick={() => handleToggle('3')}
                            >
                                <FontAwesomeIcon
                                    id="searchResults"
                                    icon={faChevronRight}
                                    className={`chevron-icon ${expandedItem === '3' ? 'rotate' : ''}`}
                                />
                                <p className="my-0 ps-3 fw-bold">Search Result</p>
                            </Accordion.Header>
                            <Accordion.Body className="px-0 pt-1 pb-2">
                                <SearchBar placeholder="Search for a stock" onSearch={onSearch} />
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
};

export default SASidebar;

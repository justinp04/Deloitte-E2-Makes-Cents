/************************************************************************************************
 * Purpose: Sidebar for Stock Analysis(SA) Page
 * Fix:
 *  - Colour
 ************************************************************************************************/
import React, { useState } from 'react';
import { Container, Accordion, Button, Offcanvas } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faBars } from '@fortawesome/free-solid-svg-icons';
import SearchBar from '../SearchBar';
import '../pages/StockAnalysis.css';
import SASidebarCard from './SASidebarCard';
import SearchCard from './SearchCard';

const SASidebar = ({ favouriteStocks, addFavourite, removeFavourite, onSearch, onNavigate = () => {} }) => {
    const [expandedItems, setExpandedItems] = useState({}); // Tracks the open/close state of each accordion item
    const [searchTerm, setSearchTerm] = useState('');
    const [showSidebar, setShowSidebar] = useState(false); // Offcanvas visibility
    const [searchResults, setSearchResults] = useState([]);

    // Toggle the accordion items and track their open/close state
    const handleToggleAccordion = (eventKey) => {
        setExpandedItems((prevState) => ({
            ...prevState,
            [eventKey]: !prevState[eventKey], // Toggle only the specific accordion item
        }));
    };

    // Handle stock search
    const handleSearch = () => {
        if (!searchTerm.trim()) {
            alert('Please enter a stock name to search.');
            return;
        }

        setSearchResults((prevResults) => [...prevResults, searchTerm]);  // Add new search term to search results
        onSearch(searchTerm); // Trigger search in StockAnalysis.js
    };

    const handleCloseSidebar = () => setShowSidebar(false); // Close the Offcanvas sidebar
    const handleShowSidebar = () => setShowSidebar(true);   // Open the Offcanvas sidebar

    // Map event keys like in NewsSidebar
    const accordionItems = ["0", "1", "2"]; // Map event keys for Stock Recommendations, Favourites, and Search Result

    return (
        <div className="sidebar-container-styling">
        {/* <div className="sidebar-container-styling position-fixed"> */}
            {/* Sidebar Toggle Button */}
            <Button
                variant="light"
                className="d-lg-none position-fixed"
                style={{border: "none", background: "none", outline: "none" }}
                onClick={handleShowSidebar}>
                <FontAwesomeIcon icon={faBars} />
            </Button>

            {/* Offcanvas Sidebar for Stock Analysis */}
            <Offcanvas
                show={showSidebar}
                onHide={handleCloseSidebar}
                responsive="lg"
                className="p-0"
                style={{ width: '300px' }}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Stock Analysis</Offcanvas.Title>
                </Offcanvas.Header>

                <Offcanvas.Body className="p-0 sidebar-background-colour">
                    <Container fluid id="sidebarContainer" className="p-0 scrollable-sidebar sidebar-background-colour">
                        <Accordion alwaysOpen className="p-0">
                            {/* Map through accordion items just like NewsSidebar */}
                            {accordionItems.map((key, index) => (
                                <Accordion.Item eventKey={key} key={key}>
                                    <Accordion.Header
                                        className="sidebar-item-header d-inline-flex justify-content-between align-items-centre w-100"
                                        onClick={() => handleToggleAccordion(key)}>
                                        <FontAwesomeIcon
                                            id={`chevron-${key}`}
                                            icon={faChevronRight}
                                            className={`chevron-icon ${expandedItems[key] ? 'rotate' : ''}`}
                                        />
                                        <p className="my-0 ps-3 fw-bold">
                                            {index === 0 ? 'Stock Recommendations' : index === 1 ? 'Favourites' : 'Search Result'}
                                        </p>
                                    </Accordion.Header>
                                    {/* Only show Accordion.Body if expanded */}
                                    {expandedItems[key] && (
                                        <Accordion.Body className="p-0">
                                            {index === 0 && (
                                                <>
                                                    <SASidebarCard
                                                        companyTitle="BEGA CHEESE LIMITED (BGA)"
                                                        status="Analysing"
                                                        onClick={() => onNavigate('Bega Cheese Limited')}
                                                        onFavourite={() => addFavourite("BEGA CHEESE LIMITED (BGA)")}
                                                    />
                                                    <SASidebarCard
                                                        companyTitle="WOOLWORTHS GROUP LIMITED (WOW)"
                                                        status="Analysed"
                                                        onClick={() => onNavigate('Woolworths Group Limited')}
                                                        onFavourite={() => addFavourite("WOOLWORTHS GROUP LIMITED (WOW)")}
                                                    />
                                                    <SASidebarCard
                                                        companyTitle="COLES GROUP LIMITED (COL)"
                                                        status="Analyse"
                                                        onClick={() => onNavigate('Coles Group Limited')}
                                                        onFavourite={() => addFavourite("COLES GROUP LIMITED (COL)")}
                                                    />
                                                </>
                                            )}

                                            {index === 1 && (
                                                <>
                                                    <SearchBar placeholder="Search your saved stocks" />
                                                    {favouriteStocks.map((stock) => (
                                                        <SASidebarCard
                                                            key={stock.id}
                                                            companyTitle={stock.title}
                                                            status="Analyse"
                                                            onClick={() => onNavigate(stock.title)}
                                                            onFavourite={add}  // Add to Database
                                                            onRemoveFavourite={removeFavourite} // Remove from Database
                                                            isFavourited={true}
                                                        />
                                                    ))}
                                                </>
                                            )}
                                            {index === 2 && (
                                                <>
                                                    <SearchBar placeholder="Search for a stock" onSearch={onSearch} />
                                                    {/* <SearchBar
                                                        placeholder="Search for a stock"
                                                        onSearch={() => handleSearch(searchTerm)} // Pass search term when search is triggered
                                                        setSearchTerm={setSearchTerm} // Pass function to update searchTerm
                                                    /> */}
                                                    
                                                    {/* {searchResults.map((result, idx) => (
                                                        <SearchCard
                                                            key={idx}
                                                            companyTitle={result}  // Display the company name
                                                            onClick={() => onNavigate(result)} // Pass the company name to navigate function
                                                        />
                                                    ))} */}
                                                </>
                                            )}
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

export default SASidebar;

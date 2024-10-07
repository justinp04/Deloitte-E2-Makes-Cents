/************************************************************************************************
 * Purpose: Sidebar for Stock Analysis(SA) Page
 * Fix:
 *  - Colour
 ************************************************************************************************/
import React, { useState, useEffect } from 'react';
import { Container, Accordion, Button, Offcanvas } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faBars } from '@fortawesome/free-solid-svg-icons';
import SearchBar from '../SearchBar';
import '../pages/StockAnalysis.css';
import SASidebarCard from './SASidebarCard';
import SearchCard from './SearchCard';
import { useMsal } from '@azure/msal-react';
import axios from 'axios';
import Swal from 'sweetalert2';
import debounce from 'lodash.debounce';


import SearchBarTwo from '../SearchBarTwo';
import SearchResultsList from '../SearchResultsList';

const SASidebar = ({ favouriteStocks, addFavourite, removeFavourite, addFavouriteToDatabase, onSearch, onNavigate = () => { } }) => {
    const [expandedItems, setExpandedItems] = useState({ "0": true, "1": true, "2": true }); // Tracks the open/close state of each accordion item
    const [showSidebar, setShowSidebar] = useState(false); // Offcanvas visibility
    
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [stockSuggestions, setStockSuggestions] = useState([]);
    const [results, setResults] = useState([]);

    const { accounts } = useMsal();
    const userEmail = accounts.length > 0 ? accounts[0].username : ''; // to get current user email

    // Debounce function for fetching suggestions to prevent too many API calls
    const fetchStockSuggestions = debounce(async (query) => {
        if (!query) {
            setStockSuggestions([]);
            return;
        }

        try {
            const response = await axios.get(`http://localhost:4000/stock-suggestions?query=${query}`);
            if (response.data && Array.isArray(response.data.stocks)) {
                setStockSuggestions(response.data.stocks);
            }
        } catch (error) {
            console.error('Error fetching stock suggestions:', error);
        }
    }, 300);

    useEffect(() => {
        if (userEmail) {
            fetchStockSuggestions(); // Fetch stock suggestions when email is available
        }
    }, [userEmail]);

    // Handle search input change
    const handleSearchInputChange = (event) => {
        const value = event.target.value;
        setSearchTerm(value);
        fetchStockSuggestions(value);
    };

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
            Swal.fire({
                icon: 'warning',
                title: 'Input Required',
                text: 'Please enter a stock name to search.',
            });
            return;
        }

        // setSearchResults((prevResults) => [...prevResults, searchTerm]);  // Add new search term to search results
        setStockSuggestions([]);
        onSearch(searchTerm); // Trigger search in StockAnalysis.js
    };

    const handleSuggestedItemClick = (suggestion) => {
        setSearchTerm(suggestion); 
        setStockSuggestions([]); 
        handleSearch();
    };

    const handleCloseSidebar = () => setShowSidebar(false); // Close the Offcanvas sidebar
    const handleShowSidebar = () => setShowSidebar(true);   // Open the Offcanvas sidebar

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
                        
                        <Accordion defaultActiveKey={["0", "1", "2"]} alwaysOpen className="mb-3 sidebar-background-colour">
                            {["0", "1", "2"].map((key, index) => (
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
                                    {expandedItems[key] && (
                                        <Accordion.Body>
                                            {index === 2 && (
                                                <>
                                                    <input
                                                        type="text"
                                                        value={searchTerm}
                                                        onChange={handleSearchInputChange}
                                                        placeholder="Search for a stock..."
                                                        className="search-input"
                                                    />
                                                    {stockSuggestions.length > 0 && (
                                                        <div className="suggestions-dropdown">
                                                            {stockSuggestions.map((suggestion, idx) => (
                                                                <div
                                                                    key={idx}
                                                                    onClick={() => handleSuggestedItemClick(suggestion)}
                                                                    className="suggestion-item"
                                                                >
                                                                    {suggestion}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                    <Button
                                                        variant="primary"
                                                        onClick={handleSearch}
                                                        className="mt-2"
                                                    >
                                                        Search
                                                    </Button>
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

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

import SearchBarTwo from '../SearchBarTwo';
import SearchResultsList from '../SearchResultsList';

const SASidebar = ({ favouriteStocks, addFavourite, removeFavourite, addFavouriteToDatabase, onSearch, filteredStocks, performSearch, onNavigate = () => { }, tutorialActive  }) => {
    const [expandedItems, setExpandedItems] = useState({ "0": true, "1": true, "2": true }); // Tracks the open/close state of each accordion item
    const [showSidebar, setShowSidebar] = useState(false); // Offcanvas visibility

    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [stockSuggestions, setStockSuggestions] = useState([]);
    const [allStocks, setAllStocks] = useState([]);
    const [results, setResults] = useState([]);

    const { accounts } = useMsal();
    const userEmail = accounts.length > 0 ? accounts[0].username : ''; // to get current user email

    // Fetch stock suggestions based on user email
    const fetchStockSuggestions = async () => {
        try {
            const response = await axios.post('https://makecentsbackenddocker-eve2hec3bmhvf5bk.australiaeast-01.azurewebsites.net/stock-suggestions',
                { email: userEmail }
            );

            if (response.data && response.data.stocks) {
                setStockSuggestions(response.data.stocks);
            }
        } catch (error) {
            console.error('Error fetching stock suggestions:', error);
        }
    };

    useEffect(() => {
        if (userEmail) {
            fetchStockSuggestions(); // Fetch stock suggestions when email is available
        }
    }, [userEmail]);

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

        setSearchResults((prevResults) => [...prevResults, searchTerm]);  // Add new search term to search results
        onSearch(searchTerm); // Trigger search in StockAnalysis.js
    };


    const handleSearchChange = (e) => {
        const term = e.target.value;


        // This needs to be changed to a common function in the common parent component
        setSearchTerm(term);


        // Need to escalate this to StockAnalysis.js somehow, can pass in a new method
        performSearch(searchTerm);
        // onSearch(term);
    };

    const handleCloseSidebar = () => setShowSidebar(false); // Close the Offcanvas sidebar
    const handleShowSidebar = () => setShowSidebar(true);   // Open the Offcanvas sidebar

    // Toggle favourite for a stock
    const toggleFavourite = (stockSymbol) => {
        const isFavourite = favouriteStocks.some(stock => stock.title === stockSymbol);
        if (isFavourite) {
            removeFavourite(stockSymbol); // Remove from favourites
        } else {
            addFavourite(stockSymbol); // Add to favourites
        }
    };

    return (
        <div className="position-fixed">
            {/* <div className="sidebar-container-styling position-fixed"> */}
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
                                    {/* Only show Accordion.Body if expanded */}
                                    {expandedItems[key] && (
                                        <Accordion.Body>
                                            {index === 0 && (
                                                <>
                                                    {stockSuggestions.length > 0 ? (
                                                        stockSuggestions.map((stock, idx) => {
                                                            // Extract the stock symbol from the stock name
                                                            const stockSymbol = stock.match(/\((.*?)\)/); // This regex will match the content inside parentheses
                                                            const symbol = stockSymbol ? stockSymbol[1] : stock; // Fallback to full name if no match is found
                                                            const isFavourited = favouriteStocks.some(fav => fav.title === symbol);

                                                            return (
                                                                <SASidebarCard
                                                                    key={idx}
                                                                    companyTitle={stock}
                                                                    onClick={() => onNavigate(stock)}
                                                                    onFavourite={() => toggleFavourite(symbol)}
                                                                    isFavourited={isFavourited}
                                                                />
                                                            );
                                                        })
                                                    ) : (
                                                        <p>No stock suggestions available.</p>
                                                    )}
                                                </>
                                            )}
                                            {index === 1 && (
                                                <>
                                                    {/* <SearchBar placeholder="Search your saved stocks" /> */}
                                                    {favouriteStocks.map((stock) => (
                                                        <SASidebarCard
                                                            key={stock.id}
                                                            companyTitle={stock.title}
                                                            status="Analyse"
                                                            onClick={() => onNavigate(stock.title)}
                                                            onFavourite={() => addFavouriteToDatabase(stock.title)} // Add to Database
                                                            onRemoveFavourite={() => removeFavourite(stock.title)} // Remove from Database
                                                            isFavourited={true}
                                                        />
                                                    ))}
                                                </>
                                            )}
                                            {index === 2 && (
                                                <>
                                                    <SearchBar placeholder="Search for a stock"
                                                        id = "stock-search-bar"
                                                        value={searchTerm}
                                                        onSearch={(term) => (onSearch(term))} />
                                                    {filteredStocks.length > 0 ? (
                                                        filteredStocks.map((stock, idx) => (
                                                            <SASidebarCard
                                                                key={idx}
                                                                companyTitle={stock.stock_name}
                                                                onClick={() => onNavigate(stock.ticker)}
                                                            // onClick={() => onSearch(stock.ticker)}
                                                            />
                                                        ))
                                                    ) : (
                                                        <p className="text-center py-2">
                                                            No results.
                                                        </p>
                                                    )}
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

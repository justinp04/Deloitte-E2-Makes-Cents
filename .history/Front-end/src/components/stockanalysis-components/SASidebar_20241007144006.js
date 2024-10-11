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
import { parsedStocksArray } from './asxStocks.js';

const SASidebar = ({ favouriteStocks, addFavourite, removeFavourite, addFavouriteToDatabase, onSearch = () => {}, onNavigate = () => {} }) => { // Set default for onSearch
    const [expandedItems, setExpandedItems] = useState({ "0": true, "1": true, "2": true });
    const [showSidebar, setShowSidebar] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const [stockSuggestions, setStockSuggestions] = useState([]);
    const [filteredStocks, setFilteredStocks] = useState([]); // Start with an empty list

    const { accounts } = useMsal();
    const userEmail = accounts.length > 0 ? accounts[0].username : '';

    // Fetch stock suggestions based on user email
    const fetchStockSuggestions = async () => {
        try {
            const response = await axios.post('http://localhost:4000/stock-suggestions', {
                email: userEmail
            });

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
            [eventKey]: !prevState[eventKey],
        }));
    };

    // Handle search input change
    const handleSearchInputChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value); // Update the search term

        // Filter stocks based on user input dynamically
        const filteredItems = parsedStocksArray.filter(stock =>
            stock.stock_name.toLowerCase().includes(value.toLowerCase())
        );

        // Update filtered stocks, display results matching the input
        setFilteredStocks(filteredItems);
    };

    // Handle stock search on clicking a stock card
    const handleStockCardClick = (stockName) => {
        setSearchTerm(stockName); // Set the search term to the stock name
        onSearch(stockName); // Trigger the search
        setFilteredStocks([]); // Clear the filtered stocks after selection
    };

    const handleCloseSidebar = () => setShowSidebar(false);
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
                                                            const stockSymbol = stock.match(/\((.*?)\)/);
                                                            const symbol = stockSymbol ? stockSymbol[1] : stock;

                                                            return (
                                                                <SASidebarCard
                                                                    key={idx}
                                                                    companyTitle={stock}
                                                                    onClick={() => handleStockCardClick(stock)} // Click to search
                                                                    onFavourite={() => addFavourite(symbol)}
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
                                                    {favouriteStocks.map((stock) => (
                                                        <SASidebarCard
                                                            key={stock.id}
                                                            companyTitle={stock.title}
                                                            status="Analyse"
                                                            onClick={() => onNavigate(stock.title)}
                                                            onFavourite={() => addFavouriteToDatabase(stock.title)}
                                                            onRemoveFavourite={() => removeFavourite(stock.title)}
                                                            isFavourited={true}
                                                        />
                                                    ))}
                                                </>
                                            )}
                                            {index === 2 && (
                                                <>
                                                    <SearchBar
                                                        placeholder="Search for a stock"
                                                        value={searchTerm}
                                                        onChange={handleSearchInputChange} // Update search term dynamically
                                                    />
                                                    {filteredStocks.length > 0 ? (
                                                        filteredStocks.map((stock, idx) => (
                                                            <SearchCard
                                                                key={idx}
                                                                companyTitle={stock.stock_name} // Display filtered stock name
                                                                onClick={() => handleStockCardClick(stock.stock_name)} // Click to search
                                                            />
                                                        ))
                                                    ) : (
                                                        <p>No results found for "{searchTerm}"</p>
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

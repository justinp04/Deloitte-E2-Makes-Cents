/************************************************************************************************
 * Purpose: Summary portion on the top of content page for stock in 'Stock Analysis' page
 * Fix: 
 ************************************************************************************************/
import React, { useState, useEffect } from 'react';
import { Accordion } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import FavouriteButton from './FavouriteButton';
import '../Components.css';
import ToggleSwitch from '../ToggleSwitch';

const StockSummary = ({ summary, references, accordionOpen, setAccordionOpen, addFavourite, removeFavourite, favouriteStocks, stockName, responseDepth, onToggleChange }) => {
    const [referencesOpen, setReferencesOpen] = useState(false); // To control the nested accordion

    const companyTitle = stockName || "No stock name provided";
    const isFavourited = favouriteStocks.some(stock => stock.title === companyTitle);

    // Fetch stock data (summary and references) from the backend when the component mounts
    useEffect(() => {
        const fetchStockData = async () => {
            try {
                const res = await fetch('http://localhost:4000/summary/stock-summary', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ stockName, response_depth: responseDepth }), // Send the stock name to the backend
                });

                const data = await res.json();
                console.log(data);
                console.log("References:", data.references);
            } catch (error) {
                console.error('Error fetching stock data:', error);
            }
        };

        if (stockName) {
            fetchStockData();
        }
    }, [stockName, responseDepth]);

    const renderSummaryTable = () => {
        // Split the summary into individual lines
        const summaryLines = summary.trim().split("\n");
    
        // Extract the first and last sentence separately
        const firstSentence = summaryLines[0]; 
        const lastSentence = summaryLines[summaryLines.length - 1]; 
    
        // Get the lines in between for the table (excluding first and last)
        const middleLines = summaryLines.slice(1, -1);
    
        // Generate table rows from the middle lines
        const summaryRows = middleLines.map((line, index) => {
            const [consideration, analysis] = line.split(": ");
            return consideration && analysis ? (
                <tr key={index}>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{consideration.trim()}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{analysis.trim()}</td>
                </tr>
            ) : null;
        });
    
        return (
            <div>
                {/* Display the first sentence */}
                <p>{firstSentence}</p>
    
                {/* Display the table with the middle content */}
                <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Investment Consideration</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Analysis</th>
                        </tr>
                    </thead>
                    <tbody>
                        {summaryRows}
                    </tbody>
                </table>
                <br />
                {/* Display the last sentence */}
                <p>{lastSentence}</p>
            </div>
        );
    };

    return (
        <div className="toggle-list-container">
            {/* Data */}
            <div className="me-5 d-flex justify-content-between flex-wrap align-items-center">
                <div className='d-flex flex-row align-items-center'>
                    <h5 className='ms-4 me-2 ps-3 fw-bold' style={{ margin: 0 }}>{stockName || "No stock name provided"}</h5>
                    <FavouriteButton
                        companyTitle={stockName || "Unknown"}
                        isFavourited={favouriteStocks.some(stock => stock.title === companyTitle)}
                        onFavourite={addFavourite}
                        onRemoveFavourite={removeFavourite}
                    />
                </div>
                <div className='d-flex flex-row align-items-center toggle-button'>
                    <ToggleSwitch
                        checked={responseDepth === 'detailed'}
                        onChange={onToggleChange}
                        id="detailedSummarySwitch"
                        style={{ paddingBottom: '20px' }}
                    />
                    <span className="toggle-switch-text ms-2" style={{ fontSize: "0.7rem" }}>Detailed Summary</span>
                </div>
            </div>

            <Accordion className='mx-4 mt-2' defaultActiveKey="0">
                <Accordion.Item eventKey="0" style={{ border: 'none', background: 'transparent' }}>
                    <Accordion.Header
                        onClick={() => {
                            setAccordionOpen(!accordionOpen); // Toggle the state
                            setReferencesOpen(false); // Close references when summary closes
                        }}
                        className="accordion-header"
                    >
                        <FontAwesomeIcon
                            icon={accordionOpen ? faChevronRight : faChevronDown}
                            className='me-2'
                        />
                        Summary
                    </Accordion.Header>
                    <Accordion.Body className="px-4" style={{ padding: '0' }}>
                        {summary ? (
                            renderSummaryTable() // Render the summary table here
                        ) : (
                            "No summary available."
                        )}

                        {/* Nested Accordion for References */}
                        <Accordion activeKey={referencesOpen ? "0" : null}>
                            <Accordion.Item eventKey="0" style={{ border: 'none', background: 'transparent' }}>
                                <Accordion.Header
                                    onClick={() => setReferencesOpen(!referencesOpen)}
                                    style={{ display: 'flex', alignItems: 'center', width: '100%', paddingRight: '0', border: 'none', fontSize: '0.8rem' }}
                                >
                                    <FontAwesomeIcon
                                        icon={referencesOpen ? faChevronDown : faChevronRight}
                                        className='me-2'
                                    />
                                    References
                                </Accordion.Header>
                                <Accordion.Body>
                                    <ol style={{ paddingLeft: '3.8rem', fontSize: "0.8rem" }}>
                                        {Array.isArray(references) && references.length > 0 ? (
                                            references.map((ref, index) => (
                                                <li key={index}>
                                                    <a href={ref} target="_blank" rel="noopener noreferrer">
                                                        {ref}
                                                    </a>
                                                </li>
                                            ))) : 
                                            (<p>No references available</p>)}
                                    </ol>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </div>
    );
};

export default StockSummary;

/************************************************************************************************
 * Purpose: Summary portion on the top of content page for stock in 'Stock Analysis' page
 * Fix: 
 ************************************************************************************************/
import React, { useState, useEffect } from 'react';
import { Accordion, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import FavouriteButton from './FavouriteButton';
import '../Components.css';
import ToggleSwitch from '../ToggleSwitch';
import SummaryTable from './SummaryTable';



const StockSummary = ({ summary, references, accordionOpen, setAccordionOpen, addFavourite, removeFavourite, favouriteStocks, responseDepth, onToggleChange, email, stockName}) => {
    const [referencesOpen, setReferencesOpen] = useState(false); // To control the nested accordion

    const isFavourited = favouriteStocks.some(stock => stock.title === companyTitle);

    const [stockName, setStockName] = useState(stock || '');
    const [stockTicker, setStockTicker] = useState('');



    // Fetch stock data (summary and references) from the backend when the component mounts
    useEffect(() => {
        const fetchStockData = async () => {
            if (!email) {
                console.warn("Attempted to fetch data before email was set.");
                return;
            }
    
            try {
                const res = await fetch('http://localhost:4000/summary/stock-summary', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ stockName, user_email: email, response_depth: responseDepth })
                });
    
                const data = await res.json();
                if (data.company_name && data.stock_ticker) {
                    setStockName(data.company_name);
                    setStockTicker(data.stock_ticker);
                }
                console.log(data);
                console.log("References:", data.references);
            } catch (error) {
                console.error('Error fetching stock data:', error);
            }
        };
    
        // Only fetch data if stockName is valid
        if (stockName && stockName !== "Unknown") {
            fetchStockData();
        }
    
    }, [stockName, email, responseDepth]);

    // Compute the company title including stock ticker
    const companyTitle = stockName && stockTicker ? `${stockName} (${stockTicker})` : "No stock name provided";

    

    return (
        <div id="stock-summary-div" className="position-sticky">
            <h1 className='page-title-text'>Stock Analysis</h1>
            {/* Data */}
            <div className="me-5 d-flex justify-content-between flex-wrap align-items-center">
                <div className='d-flex flex-row align-items-center'>
                    <h5 className='me-2 page-subtitle1-text' style={{ margin: 0 }}>{stockName || "No stock name provided"}</h5>
                    <FavouriteButton
                        companyTitle={`${stockName} (${stockTicker})` || "Unknown"}
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
                    <span className="toggle-switch-text ms-2">Detailed Summary</span>
                </div>
            </div>

            <Accordion className='' defaultActiveKey="0">
                <Accordion.Item eventKey="0" style={{ border: 'none'}}>
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
                        <div className="fw-bold">Summary</div>
                       
                    </Accordion.Header>
                    <Accordion.Body className="px-4">
                        {summary ? (
                                <SummaryTable summary={summary} responseDepth={responseDepth} /> 
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
                                    <div className="fw-bold">References</div>
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
            <hr className='m-0'/>
        </div>
    );
};

export default StockSummary;
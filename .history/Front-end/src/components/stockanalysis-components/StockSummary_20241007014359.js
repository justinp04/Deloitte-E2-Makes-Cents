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
                    body: JSON.stringify({ stockName, response_depth: responseDepth, user }), // Send the stock name to the backend
                });

                const data = await res.json();
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
        
    }, [stockName, responseDepth]);

    // return (
    //     <div style={{backgroundColor:"White"}}>
    //          <div className="stock-summary-container position-fixed" style={{marginTop:"70px"}}>
    //             <Row>
    //                 {/* Page title */}
    //                 <Col className="page-title-text">
    //                     Stock Analysis
    //                 </Col>
    //             </Row>
    //             <Row className='me-5 d-flex justify-content-between flex-wrap align-items-center'>
    //                 {/* Company name  */}
    //                 <Col className="page-subtitle1-text d-flex">
    //                     <h5 className='me-2 fw-bold' style={{ margin: 0 }}>{stockName || "No stock name provided"}</h5>
    //                     <FavouriteButton
    //                         companyTitle={stockName || "Unknown"}
    //                         isFavourited={favouriteStocks.some(stock => stock.title === companyTitle)}
    //                         onFavourite={addFavourite}
    //                         onRemoveFavourite={removeFavourite}
    //                     />
    //                      {/* <ToggleSwitch
    //                         checked={responseDepth === 'detailed'}
    //                         onChange={onToggleChange}
    //                         id="detailedSummarySwitch"
    //                         style={{ paddingBottom: '20px' }}
    //                         className="stock-summary-container "
    //                     />
    //                     <span className="toggle-switch-text ms-2" style={{ fontSize: "0.7rem" }}>Detailed Summary</span> */}
    //                 </Col>
    //                 <Col className="d-flex justify-content-end">
    //                     {/* Add button to add company news feed to user list  */}
    //                     <ToggleSwitch
    //                         checked={responseDepth === 'detailed'}
    //                         onChange={onToggleChange}
    //                         id="detailedSummarySwitch"
    //                         style={{ paddingBottom: '20px' }}
    //                         className="stock-summary-container "
    //                     />
    //                     <span className="toggle-switch-text ms-2" style={{ fontSize: "0.7rem" }}>Detailed Summary</span>
    //                 </Col>
    //             </Row>
    //             <Row>
    //                 <Accordion defaultActiveKey="0">
    //                     <Accordion.Item  className="" eventKey="0">
    //                         <Accordion.Header
    //                             onClick={() => {
    //                                 setAccordionOpen(!accordionOpen); // Toggle the state
    //                                 setReferencesOpen(false); // Close references when summary closes
    //                             }}
    //                             className="accordion-header"
    //                             style={{ padding: '0', background: 'transparent', border: 'none' }} // Removes padding
    //                         >
    //                             <FontAwesomeIcon
    //                                 icon={accordionOpen ? faChevronRight : faChevronDown}
    //                                 className='me-2'
    //                             />
    //                             <div className='fw-bold'>Summary</div>
    //                         </Accordion.Header>
    //                         <Accordion.Body className="ms-4">
    //                             {summary ? (
    //                                     <SummaryTable summary={summary} responseDepth={responseDepth} /> 
    //                                 ) : (
    //                                     "No summary available."
    //                                 )}

    //                             {/* Nested Accordion for References */}
    //                             <Accordion activeKey={referencesOpen ? "0" : null}>
    //                                 <Accordion.Item eventKey="0" style={{ border: 'none', background: 'transparent' }}>
    //                                     <Accordion.Header
    //                                         onClick={() => setReferencesOpen(!referencesOpen)}
    //                                         style={{ display: 'flex', alignItems: 'center', width: '100%', paddingRight: '0', border: 'none', fontSize: '0.8rem' }}
    //                                     >
    //                                         <FontAwesomeIcon
    //                                             icon={referencesOpen ? faChevronDown : faChevronRight}
    //                                             className='me-2'
    //                                         />
    //                                         References
    //                                     </Accordion.Header>
    //                                     <Accordion.Body>
    //                                         <ol style={{ paddingLeft: '3.8rem', fontSize: "0.8rem" }}>
    //                                             {Array.isArray(references) && references.length > 0 ? (
    //                                                 references.map((ref, index) => (
    //                                                     <li key={index}>
    //                                                         <a href={ref} target="_blank" rel="noopener noreferrer">
    //                                                             {ref}
    //                                                         </a>
    //                                                     </li>
    //                                                 ))) : 
    //                                                 (<p>No references available</p>)}
    //                                         </ol>
    //                                     </Accordion.Body>
    //                                 </Accordion.Item>
    //                             </Accordion>
    //                         </Accordion.Body>
    //                     </Accordion.Item>
    //                 </Accordion>
    //             </Row>
    //             <hr className='m-0'/>
    //         </div>
    //     </div>
       
    // );

    return (
        <div id="stock-summary-div" className="position-sticky">
            <h1 className='page-title-text'>Stock Analysis</h1>
            {/* Data */}
            <div className="me-5 d-flex justify-content-between flex-wrap align-items-center">
                <div className='d-flex flex-row align-items-center'>
                    <h5 className='me-2 page-subtitle1-text' style={{ margin: 0 }}>{stockName || "No stock name provided"}</h5>
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

    // return (
    //     <div className="toggle-list-container">
    //         <h1>Stock Analysis</h1>
    //         {/* Data */}
    //         <div className="me-5 d-flex justify-content-between flex-wrap align-items-center">
    //             <div className='d-flex flex-row align-items-center'>
    //                 <h5 className='ms-4 me-2 ps-3 fw-bold' style={{ margin: 0 }}>{stockName || "No stock name provided"}</h5>
    //                 <FavouriteButton
    //                     companyTitle={stockName || "Unknown"}
    //                     isFavourited={favouriteStocks.some(stock => stock.title === companyTitle)}
    //                     onFavourite={addFavourite}
    //                     onRemoveFavourite={removeFavourite}
    //                 />
    //             </div>
    //             <div className='d-flex flex-row align-items-center toggle-button'>
    //                 <ToggleSwitch
    //                     checked={responseDepth === 'detailed'}
    //                     onChange={onToggleChange}
    //                     id="detailedSummarySwitch"
    //                     style={{ paddingBottom: '20px' }}
    //                 />
    //                 <span className="toggle-switch-text ms-2" style={{ fontSize: "0.7rem" }}>Detailed Summary</span>
    //             </div>
    //         </div>

    //         <Accordion className='mx-4 mt-2' defaultActiveKey="0">
    //             <Accordion.Item eventKey="0" style={{ border: 'none', background: 'transparent' }}>
    //                 <Accordion.Header
    //                     onClick={() => {
    //                         setAccordionOpen(!accordionOpen); // Toggle the state
    //                         setReferencesOpen(false); // Close references when summary closes
    //                     }}
    //                     className="accordion-header"
    //                 >
    //                     <FontAwesomeIcon
    //                         icon={accordionOpen ? faChevronRight : faChevronDown}
    //                         className='me-2'
    //                     />
    //                     Summary
    //                 </Accordion.Header>
    //                 <Accordion.Body className="px-4" style={{ padding: '0' }}>
    //                     {summary ? (
    //                             <SummaryTable summary={summary} responseDepth={responseDepth} /> 
    //                         ) : (
    //                             "No summary available."
    //                         )}

    //                     {/* Nested Accordion for References */}
    //                     <Accordion activeKey={referencesOpen ? "0" : null}>
    //                         <Accordion.Item eventKey="0" style={{ border: 'none', background: 'transparent' }}>
    //                             <Accordion.Header
    //                                 onClick={() => setReferencesOpen(!referencesOpen)}
    //                                 style={{ display: 'flex', alignItems: 'center', width: '100%', paddingRight: '0', border: 'none', fontSize: '0.8rem' }}
    //                             >
    //                                 <FontAwesomeIcon
    //                                     icon={referencesOpen ? faChevronDown : faChevronRight}
    //                                     className='me-2'
    //                                 />
    //                                 References
    //                             </Accordion.Header>
    //                             <Accordion.Body>
    //                                 <ol style={{ paddingLeft: '3.8rem', fontSize: "0.8rem" }}>
    //                                     {Array.isArray(references) && references.length > 0 ? (
    //                                         references.map((ref, index) => (
    //                                             <li key={index}>
    //                                                 <a href={ref} target="_blank" rel="noopener noreferrer">
    //                                                     {ref}
    //                                                 </a>
    //                                             </li>
    //                                         ))) : 
    //                                         (<p>No references available</p>)}
    //                                 </ol>
    //                             </Accordion.Body>
    //                         </Accordion.Item>
    //                     </Accordion>
    //                 </Accordion.Body>
    //             </Accordion.Item>
    //         </Accordion>
    //     </div>
    // );
};

export default StockSummary;
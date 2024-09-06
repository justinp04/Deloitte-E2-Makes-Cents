/************************************************************************************************
 * Purpose: Summary portion on the top of content page for stock in 'Stock Analysis' page
 * Fix: 
 ************************************************************************************************/
import React, { useState } from 'react';
import { Accordion } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import FavouriteButton from './FavouriteButton';
import '../Components.css';
import ToggleSwitch from '../ToggleSwitch';

const StockSummary = ({ accordionOpen, setAccordionOpen, addFavourite, removeFavourite, favouriteStocks }) => {
    const [referencesOpen, setReferencesOpen] = useState(false); // To control the nested accordion
    const [isChecked, setChecked] = useState(true);

    // Mock database for references
    const mockDatabase = [
        {
            id: 1,
            title: 'Introduction to React',
            url: 'https://reactjs.org/docs/getting-started.html'
        },
        {
            id: 2,
            title: 'Bootstrap Documentation',
            url: 'https://getbootstrap.com/docs/5.0/getting-started/introduction/'
        },
        {
            id: 3,
            title: 'FontAwesome Icons',
            url: 'https://fontawesome.com/icons?d=gallery'
        }
    ];

    // Use the mock database as references
    const [references, setReferences] = useState(mockDatabase);

    const companyTitle = "BEGA CHEESE LIMITED (BGA)"; // The stock name to be added/removed from favourites 

    // Determine if this company is already in the favourites list
    const isFavourited = favouriteStocks.some(stock => stock.title === companyTitle);

    const handleChange = () => {
        setChecked(!isChecked);
    };

    return (
        <div className="toggle-list-container">
            {/* Data */}
            <div className="me-5 d-flex w-100" style={{}}>
                <div className='d-flex flex-row align-items-center'>
                    <h5 className='ms-4 me-2 ps-3 fw-bold' style={{ margin: 0 }}>{companyTitle}</h5>
                    <FavouriteButton
                        companyTitle={companyTitle}
                        isFavourited={isFavourited}
                        onFavourite={addFavourite}
                        onRemoveFavourite={removeFavourite} />
                </div>
                <div className='d-flex flex-row align-items-center position-relative end-0'>
                    <ToggleSwitch
                        checked={isChecked}
                        onChange={handleChange}
                        id="detaildSummarySwitch"
                        style={{ marginLeft: 'auto', paddingBottom: '20px' }} /* This will push the toggle switch to the end */ />
                    <span className="toggle-switch-text" style={{ fontSize: "0.7rem" }}>Detailed Summary</span>
                </div>
            </div>

            <Accordion className='mx-4' defaultActiveKey="0">
                <Accordion.Item eventKey="0" style={{ border: 'none', background: 'transparent' }}>
                    <Accordion.Header
                        onClick={() => {
                            setAccordionOpen(!accordionOpen); // Toggle the state
                            setReferencesOpen(false); // Close references when summary closes
                        }}
                        style={{ display: 'flex', alignItems: 'center', width: '1370px', border: 'none' }}
                    >
                        <FontAwesomeIcon
                            icon={accordionOpen ? faChevronRight : faChevronDown}
                            className='me-2'
                        />
                        Summary
                    </Accordion.Header>
                    <Accordion.Body className="px-4" style={{ padding: '0' }}>
                        As a beginner investor with a long-term investment horizon and a higher risk tolerance, investing in Bega Cheese Limited could be a suitable option. Given your neutral stance on potential losses and ability to withstand short-term declines, Bega Cheese Limited, as a well-established company in the food industry, may offer potential for higher returns over the long term. However, it's important to conduct thorough research and consider diversifying your portfolio with other stocks as well.

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
                                        {references.length > 0 ? (
                                            references.map((ref) => (
                                                <li key={ref.id}>
                                                    <a href={ref.url} target="_blank" rel="noopener noreferrer">
                                                        {ref.title}
                                                    </a>
                                                </li>
                                            ))
                                        ) : (
                                            <p>No references available</p>
                                        )}
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

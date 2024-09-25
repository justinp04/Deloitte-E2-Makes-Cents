import React, { useState, useEffect } from 'react';
import { Accordion } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import SearchBar from '../SearchBar';
import '../pages/StockAnalysis.css';
import SASidebarCard from './SASidebarCard';

const SASidebar = ({ favouriteStocks, addFavourite, onNavigate = () => { }, tutorialActive }) => {
    const [openKeys, setOpenKeys] = useState([]);
    const [expandedItem, setExpandedItem] = useState(false);

    useEffect(() => {
        if (tutorialActive) {
            setOpenKeys(['0', '1', '2']); // Expand all accordions when the tutorial is active
        }
    }, [tutorialActive]);

    const handleSelect = (eventKey) => {
        if (openKeys.includes(eventKey)) {
            setOpenKeys(openKeys.filter(key => key !== eventKey));
        } else {
            setOpenKeys([...openKeys, eventKey]);
        }
    };

    const handleCardClick = (content) => {
        onNavigate(content);
    };

    const handleToggle = (eventKey) => {
        setExpandedItem(expandedItem === eventKey ? null : eventKey);
    };

    return (
        <div>
            <Accordion
                className='mt-5 p-0'
                style={{ width: '300px' }}
                activeKey={openKeys}
                onSelect={handleSelect}
            >
                {/* 'Stock Recommendations' accordion item */}
                <Accordion.Item eventKey="0" onClick={() => handleToggle("0")}>
                    <Accordion.Header className={`d-inline-flex justify-content-between align-items-centre w-100 ${expandedItem === "0" ? 'focus' : ''}`}>
                        <FontAwesomeIcon
                            id="stockRecommendations"
                            icon={faChevronRight}
                            className={`chevron-icon ${expandedItem === "0" ? 'rotate' : ''}`} />
                        <p className="my-0 ps-3 fw-bold">Stock Recommendations</p>
                    </Accordion.Header>
                    <Accordion.Body className='p-0'>
                        <SASidebarCard
                            companyTitle="BEGA CHEESE LIMITED (BGA)"
                            status="Analysing"
                            onClick={() => handleCardClick('Bega Cheese Limited')}
                            onFavourite={addFavourite}
                        />
                        <SASidebarCard
                            companyTitle="WOOLWORTHS GROUP LIMITED (WOW)"
                            status="Analysed"
                            onClick={() => handleCardClick('Woolworths Group Limited')}
                            onFavourite={addFavourite}
                        />
                        <SASidebarCard
                            companyTitle="COLES GROUP LIMITED (COL)"
                            status="Analyse"
                            onClick={() => handleCardClick('Coles Group Limited')}
                            onFavourite={addFavourite}
                        />
                    </Accordion.Body>
                </Accordion.Item>
                {/* 'Favourites' accordion item */}
                <Accordion.Item eventKey='1' className="item" onClick={() => handleToggle("1")}>
                    <Accordion.Header className={`d-inline-flex justify-content-between align-items-centre w-100 ${expandedItem === "1" ? 'focus' : ''}`}>
                        <FontAwesomeIcon
                            id="favourites"
                            icon={faChevronRight}
                            className={`chevron-icon ${expandedItem === "1" ? 'rotate' : ''}`} />
                        <p className="my-0 ps-3 fw-bold">Favourites</p>
                    </Accordion.Header>
                    <Accordion.Body className='px-0 pt-1 pb-1'>
                        <SearchBar placeholder="Search your saved stocks" />
                        {favouriteStocks.map(stock => (
                            <SASidebarCard
                                key={stock.id}
                                companyTitle={stock.title}
                                status="Analyse"
                                onClick={() => handleCardClick(stock.title)}
                            />
                        ))}
                    </Accordion.Body>
                </Accordion.Item>
                {/* 'Search Result' accordion item */}
                <Accordion.Item eventKey='2' className="item" onClick={() => handleToggle("2")}>
                    <Accordion.Header className={`d-inline-flex justify-content-between align-items-centre w-100 ${expandedItem === "2" ? 'focus' : ''}`}>
                        <FontAwesomeIcon
                            id="searchResults"
                            icon={faChevronRight}
                            className={`chevron-icon ${expandedItem === "2" ? 'rotate' : ''}`} />
                        <p className="my-0 ps-3 fw-bold">Search Result</p>
                    </Accordion.Header>
                    <Accordion.Body className='px-0 pt-1 pb-0'>
                        <SearchBar placeholder="Search for a stock" />
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </div>
    );
};

export default SASidebar;

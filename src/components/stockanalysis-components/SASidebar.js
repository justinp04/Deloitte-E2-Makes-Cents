/************************************************************************************************
 * Purpose: Sidebar for Stock Analysis(SA) Page
 * Fix:
 *  - Colour
 ************************************************************************************************/
import React, { useState } from 'react';
import { Accordion } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronDown } from '@fortawesome/free-solid-svg-icons';

import SearchBar from '../SearchBar';
import '../pages/StockAnalysis.css';
import SASidebarCard from './SASidebarCard';

const SASidebar = ({ favouriteStocks, addFavourite, onNavigate = () => {} }) => {
    const [openKeys, setOpenKeys] = useState([]);

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

    return (
        <div>
            <Accordion 
                className='mt-5 p-0' 
                style={{ width: '300px' }} 
                activeKey={openKeys} 
                onSelect={handleSelect}
            >
                <Accordion.Item eventKey='0' className="item">
                    <Accordion.Header style={{ 
                        backgroundColor: '#F8F9FA', 
                        color: openKeys.includes('0') ? '#000' : 'inherit', 
                        border: openKeys.includes('0') ? '1px solid #E0E0E0' : 'none',
                        boxShadow: openKeys.includes('0') ? '0 0 5px rgba(0, 0, 0, 0.1)' : 'none',
                        display: 'flex', 
                        alignItems: 'center' 
                    }}>
                        <FontAwesomeIcon 
                            icon={openKeys.includes('0') ? faChevronDown : faChevronRight} 
                            className='me-2' 
                        />
                        Stock Recommendations
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
                <Accordion.Item eventKey='2' className="item">
                    <Accordion.Header style={{ 
                        backgroundColor: '#F8F9FA', 
                        color: openKeys.includes('2') ? '#000' : 'inherit',
                        border: openKeys.includes('2') ? '1px solid #E0E0E0' : 'none',
                        boxShadow: openKeys.includes('2') ? '0 0 5px rgba(0, 0, 0, 0.1)' : 'none',
                        display: 'flex', 
                        alignItems: 'center' 
                    }}>
                        <FontAwesomeIcon 
                            icon={openKeys.includes('2') ? faChevronDown : faChevronRight} 
                            className='me-2' 
                        />
                        Favourites
                    </Accordion.Header>
                    <Accordion.Body className='px-0 pt-1 pb-0'>
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
            </Accordion>
        </div>
    );
};

export default SASidebar;

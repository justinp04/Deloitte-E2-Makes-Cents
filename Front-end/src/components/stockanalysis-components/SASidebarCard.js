/************************************************************************************************
 * Purpose: Card for companies that will be added to stock analysis sidebar
 * Fix: 
 ************************************************************************************************/
import React from 'react';
import { Card } from 'react-bootstrap';
import FavouriteButton from './FavouriteButton';

const SASidebarCard = ({ companyTitle, onClick, addFavourite, onRemoveFavourite, isFavourited}) => {
    return (
        <Card
            style={{ cursor: 'pointer', backgroundColor: '#FFFFFF', borderRadius: '0', border: 'none' }}
            onClick={onClick}
        >
            <Card.Body className='fw-bold d-flex justify-content-between align-items-center' style={{ fontSize: '70%', marginLeft:"10px" }}>
                {companyTitle}
                <div className="d-flex align-items-center">
                    <FavouriteButton
                        companyTitle={companyTitle}
                        onFavourite={addFavourite}
                        onRemoveFavourite={onRemoveFavourite}
                        isFavourited={isFavourited}
                    />
                </div>
            </Card.Body>
        </Card>
    );
};

export default SASidebarCard;

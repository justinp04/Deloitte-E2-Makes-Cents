/************************************************************************************************
 * Purpose: Card for companies that will be added to stock analysis sidebar
 * Fix: 
 ************************************************************************************************/
import React from 'react';
import { Card, Button } from 'react-bootstrap';
import FavouriteButton from './FavouriteButton';

const SASidebarCard = ({ id, companyTitle, onClick, onFavourite, statusId }) => {

    return (
        <Card
            id = {id}
            style={{ cursor: 'pointer', backgroundColor: '#FFFFFF', borderRadius: '0', border: 'none' }}
            onClick={onClick}
        >
            <Card.Body className='fw-bold d-flex justify-content-between align-items-center' style={{ fontSize: '65%', marginLeft:"10px" }}>
                {companyTitle}
                <div className="d-flex align-items-center">
                    <FavouriteButton
                        id = {statusId}
                        companyTitle={companyTitle}
                        onFavourite={onFavourite}
                    />
                </div>
            </Card.Body>
        </Card>
    );
};

export default SASidebarCard;

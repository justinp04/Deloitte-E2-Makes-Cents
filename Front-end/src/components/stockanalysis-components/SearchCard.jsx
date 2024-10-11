import React from 'react';
import { Card } from 'react-bootstrap';

const SearchCard = ({ companyTitle, onClick }) => {
    return (
        <Card
            style={{ cursor: 'pointer', border: 'none' }}
            onClick={onClick}
        >
            <Card.Body 
                className='fw-bold' 
                style={{ fontSize: '65%', textTransform: 'uppercase' }}
            >
                {companyTitle}
            </Card.Body>
        </Card>
    );
};

export default SearchCard;

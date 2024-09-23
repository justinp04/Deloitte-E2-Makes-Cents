import React from 'react';
import { Card } from 'react-bootstrap';

const NewsSidebarCard = ({ companyTitle, onClick }) => {
    return (
        <Card
            style={{ cursor: 'pointer', backgroundColor: '#FFFFFF', borderRadius: '0', border: 'none' }}
            onClick={onClick}
        >
            <Card.Body 
                className='fw-bold' 
                style={{ fontSize: '75%', textTransform: 'uppercase' }}
            >
                {companyTitle}
            </Card.Body>
        </Card>
    );
};

export default NewsSidebarCard;

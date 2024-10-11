import React from 'react';
import { Card } from 'react-bootstrap';

const NewsSidebarCard = ({ companyTitle, onClick, className }) => {
    return (
        <Card
            style={{ cursor: 'pointer', border: 'none' }}
            onClick={onClick}
            className={`news-sidebar-card ${className}`}
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

export default NewsSidebarCard;
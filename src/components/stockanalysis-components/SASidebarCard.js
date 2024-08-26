import React from 'react';
import { Card, Button } from 'react-bootstrap';
import FavouriteButton from './FavouriteButton';

const SASidebarCard = ({ companyTitle, status = "Analyse", onClick, onFavourite }) => {
    const statusStyles = {
        Analyse: { backgroundColor: '#000000', color: '#FFFFFF' },
        Analysing: { backgroundColor: '#9747FF', color: '#FFFFFF' },
        Analysed: { backgroundColor: '#0085FF', color: '#FFFFFF' },
    };

    return (
        <Card 
            style={{ cursor: 'pointer', backgroundColor: '#FFFFFF', borderRadius: '0', border: 'none' }} 
            onClick={onClick}
        >
            <Card.Body className='fw-bold d-flex justify-content-between align-items-center' style={{ fontSize: '65%' }}>
                {companyTitle}
                <div className="d-flex align-items-center">
                    <FavouriteButton 
                        companyTitle={companyTitle} 
                        onFavourite={onFavourite} 
                    />
                    <Button 
                        className="btn-sm ms-2" 
                        onClick={(e) => {
                            e.stopPropagation();
                            onClick();
                        }}
                        style={{
                            ...statusStyles[status], 
                            borderRadius: '30px', 
                            fontSize: '80%', 
                            fontWeight: 'bold', 
                            width: '60px',
                            border: 'none',
                        }}
                    >
                        {status}
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
};

export default SASidebarCard;

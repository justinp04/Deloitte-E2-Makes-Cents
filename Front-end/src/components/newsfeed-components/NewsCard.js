/************************************************************************************************
 * Authors: Alyssha Kwok
 * Purpose: News article card 
 ************************************************************************************************/
import React from 'react';

import '../pages/NewsFeed.css';
import { format } from 'date-fns';

const NewsCard = ({ imageSrc, newsTitle, newsSummary, date, onClick }) => {
    const formattedDate = format(new Date(date), "eeee do MMMM yyyy h:mm a");

    return (
        <div onClick={onClick} style={{ cursor: 'pointer'}}>
            <small className="text-muted">{formattedDate}</small>
            <div className="news-card mb-3">
                <div className="d-flex align-items-center p-3">
                    <div className="flex-shrink-0">
                        <img
                            src={imageSrc}
                            alt="Article Image"
                            style={{
                                height: '5.5rem',
                                width: '5.5rem',
                                borderRadius: '15px',
                            }}
                        />
                    </div>
                    <div className="flex-grow-1 ms-3">
                        <div className="page-subtitle2-text">
                            {newsTitle}
                        </div>
                        <div className="page-normal-text" style={{marginTop: '5px' }}>
                            {newsSummary}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NewsCard;


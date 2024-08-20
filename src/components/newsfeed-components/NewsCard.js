/************************************************************************************************
 * Purpose: News article card 
 * Fix: 
 *  - article image positioning
 *  - 
 ************************************************************************************************/
import React from 'react';
import '../pages/NewsFeed.css';

const NewsCard = ({ imageSrc, newsTitle, newsInfo, date }) => {
  return (
    <div>
      <small className="text-muted">{date}</small>
      <div className="card mb-3">
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
            <div className="fw-bold" style={{ fontSize: '20px' }}>
              {newsTitle}
            </div>
            <div className="fw-normal" style={{ fontSize: '16px', marginTop: '5px' }}>
              {newsInfo}
            </div>
          </div>
        </div>
      </div>
    </div>  
  );
}

export default NewsCard;

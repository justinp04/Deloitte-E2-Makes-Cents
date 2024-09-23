/************************************************************************************************
 * Authors: Alyssha Kwok
 * Purpose: Company stock title on news feed page
 ************************************************************************************************/
import React from "react";
import '../pages/NewsFeed.css';

const NewsCompanyTitle = ({ textContent }) => {
    return (
        <div className="d-flex align-items-center company-title-div">
            <div className="flex-grow-1 fw-bold company-title-text">
                {textContent}
            </div>
        </div>
    );
}
export default NewsCompanyTitle;
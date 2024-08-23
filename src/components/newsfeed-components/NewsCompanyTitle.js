/************************************************************************************************
 * Purpose: Company stock title on news feed page
 * Fix: 
 ************************************************************************************************/
import React from "react";

import '../pages/NewsFeed.css';


const NewsCompanyTitle = () => {
    return (
        <div className="d-flex align-items-center company-title-div">
            <div className="flex-shrink-0">
                <img src="./images/BegaLogo.jpeg" alt="User Profile" className="company-title-img"/>
            </div>
            <div className="flex-grow-1 ms-3 fw-bold company-title-text">
                Bega Cheese Limited (BGA)
            </div>
        </div>
    );
}
export default NewsCompanyTitle;
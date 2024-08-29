/************************************************************************************************
 * Purpose: News Feed Page
 * Fix: 
 *  - When have time, fix position of news feed title and company title?
 ************************************************************************************************/

import React from 'react';

import NewsCompanyTitle from '../newsfeed-components/NewsCompanyTitle';
import NewsHeroSection from '../newsfeed-components/NewsHeroSection';
import NewsList from '../newsfeed-components/NewsList';
import NewsSidebar from '../newsfeed-components/NewsSidebar';
import FilterButton from '../newsfeed-components/FilterButton';
import './NewsFeed.css';

function NewsFeed() {
    return (
        <div className="page-container">
            <div className="sidebar" style={{ zIndex: 1000 }}>
                <NewsSidebar />
            </div>
            <div className="content">
                <div className="title-container">
                    <NewsCompanyTitle textContent="BGA News Feed"/>
                </div>
                {/* <div className="d-flex align-items-center">
                </div> */}
                <NewsHeroSection/>
                <hr />
                <div className="d-flex align-items-center justify-content-between me-5">
                    <h4 className='filter-title my-2'>Most Recent</h4>
                    <FilterButton />
                </div>
                <NewsList />
            </div>
        </div>
    );
}

export default NewsFeed;
/************************************************************************************************
 * Purpose: News Feed Page
 * Fix: 
 *  - When have time, fix position of news feed title and company title?
 ************************************************************************************************/

import React from 'react';

import NewsCompanyTitle from '../newsfeed-components/NewsCompanyTitle';
import NewsList from '../newsfeed-components/NewsList';
import NewsSidebar from '../newsfeed-components/NewsSidebar';
import FilterButton from '../newsfeed-components/FilterButton';
import './NewsFeed.css';

function NewsFeed({ isSignedIn }) {
  return (
    <div className="page-container">
      <div className="sidebar">
        <NewsSidebar />
      </div>
      <div className="content">
        <div className="title-container">
          <h1 className="page-header ms-3">News Feeds</h1>
        </div>
        <div className="d-flex align-items-center">
          <NewsCompanyTitle />
        </div>
          <div className="d-flex align-items-center justify-content-between me-5">
            <h4 className='filter-title'>Most Recent</h4>
            <FilterButton/>
          </div>
        <NewsList />
      </div>
    </div>
  );
}

export default NewsFeed;
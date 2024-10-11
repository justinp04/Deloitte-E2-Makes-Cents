/************************************************************************************************
 * Authors: Alyssha Kwok
 * Purpose: News articles list on news feed page
 ************************************************************************************************/
import React from 'react';

import NewsCard from './NewsCard';

const NewsList = ({ articles }) => {
  // const newsArticle = [
  //   { date: 'Thursday 9th May 2024 9:10 AM', imageSrc: './images/BegaLogo.jpeg', newsTitle:'Article 1', newsInfo: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' }, 
  //   { date: 'Thursday 9th May 2024 9:10 AM', imageSrc: './images/BegaLogo.jpeg', newsTitle:'Article 2', newsInfo: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' },
  //   { date: 'Thursday 9th May 2024 9:10 AM', imageSrc: './images/BegaLogo.jpeg', newsTitle:'Article 3', newsInfo: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' },
  //   { date: 'Thursday 9th May 2024 9:10 AM', imageSrc: './images/BegaLogo.jpeg', newsTitle:'Article 4', newsInfo: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' }, 
  //   { date: 'Thursday 9th May 2024 9:10 AM', imageSrc: './images/BegaLogo.jpeg', newsTitle:'Article 5', newsInfo: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' },
  //   { date: 'Thursday 9th May 2024 9:10 AM', imageSrc: './images/BegaLogo.jpeg', newsTitle:'Article 6', newsInfo: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' },
  // ];

  if (!articles || articles.length === 0) {
    return <p>No news available now</p>;
  }

  return (
    <div>
      {articles.map((article, index) => (
        <div key={index} className="news-item">
          <h5>
            <a href={article.article_url} target="_blank" rel="noopener noreferrer">
              {article.article_title}
            </a>
          </h5>
          <img src={article.article_photo_url} alt={article.article_title} className="news-image" />
          <p>{article.article_summary}</p>
        </div>
      ))}
    </div>
  );
};

export default NewsList;
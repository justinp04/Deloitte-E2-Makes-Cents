/************************************************************************************************
 * Authors: Alyssha Kwok
 * Purpose: News articles list on news feed page
 ************************************************************************************************/
import React from 'react';

import NewsCard from './NewsCard';

const NewsList = ({ articles }) => {

  const NewsList = ({ articles }) => {
    if (!articles || articles.length === 0) {
        return <p>No news available now</p>;
    }

    return (
        <div>
            {articles.map((article, index) => (
                <NewCard
                    key={index}
                    imageSrc={article.article_photo_url}
                    title={article.article_title}
                    summary={article.article_summary || "No summary available"} // Default summary if not available
                    date={new Date(article.post_time_utc).toLocaleString()} // Format the date
                    onClick={() => window.open(article.article_url, '_blank')} // Open the article in a new tab
                />
            ))}
        </div>
    )
};

export default NewsList;
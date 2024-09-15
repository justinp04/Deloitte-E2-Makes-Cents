/************************************************************************************************
 * Authors: Alyssha Kwok
 * Purpose: News articles list on news feed page
 ************************************************************************************************/
import React from 'react';

import NewsCard from './NewsCard';

const NewsList = () => {
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
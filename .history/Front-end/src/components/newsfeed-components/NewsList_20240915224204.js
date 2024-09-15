/************************************************************************************************
 * Authors: Alyssha Kwok
 * Purpose: News articles list on news feed page
 ************************************************************************************************/
import React from 'react';

import NewsCard from './NewsCard';

const NewsList = ({ articles }) => {
    if (!articles || articles.length === 0) {
        return <p>No news available now</p>;
    }

    return (
        <div>
            {articles.map((article, index) => (
                <div key={index} className="news-item-container">
                    <div className="news-item-content" onClick={() => window.open(article.article_url, '_blank')}>
                        <div className="news-image-container">
                            <img src={article.article_photo_url} alt={article.article_title} className="news-image" />
                        </div>
                        <div className="news-content">
                            <h5 className="news-title">{article.article_title}</h5>
                            <p className="news-summary">{article.article_summary}</p>
                        </div>
                    </div>
                    <div className="news-time">{new Date(article.post_time_utc).toLocaleString()}</div>
                </div>
            ))}
        </div>
    );
};

export default NewsList;
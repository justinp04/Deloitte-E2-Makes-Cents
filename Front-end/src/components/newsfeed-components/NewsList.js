import React from 'react';
import NewsCard from './NewsCard';

const NewsList = ({ articles }) => {
    return (
        <div className="mt-2">
            {articles.map((article, index) => (
                <NewsCard
                    key={index}
                    date={article.post_time_utc}
                    imageSrc={article.article_photo_url}
                    newsTitle={article.article_title}
                    // newsInfo={`Source: ${article.source}`}
                    newsSummary={article.article_summary}
                    onClick={() => window.open(article.article_url, '_blank')}
                />
            ))}
        </div>
    );
};

export default NewsList;
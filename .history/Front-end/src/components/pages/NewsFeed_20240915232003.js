import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NewsCompanyTitle from '../newsfeed-components/NewsCompanyTitle';
import NewsHeroSection from '../newsfeed-components/NewsHeroSection';
import NewsList from '../newsfeed-components/NewsList';
import NewsSidebar from '../newsfeed-components/NewsSidebar';
import FilterButton from '../newsfeed-components/FilterButton';
import './NewsFeed.css';

function NewsFeed() {
    const [newsArticles, setNewsArticles] = useState([]);
    const [searchTerm, setSearchTerm] = useState('BGA'); // Default company symbol

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/news?symbol=${searchTerm}`);
                const news = response.data.data.news;

                // Assuming the first article is for the hero section
                const heroArticle = news[0] || { article_title: '', article_photo_url: '', article_summary: '' };

                setNewsArticles({
                    hero: heroArticle,
                    articles: news
                });
            } catch (error) {
                console.error('Error fetching news:', error);
            }
        };

        fetchNews();
    }, [searchTerm]); // Fetch news whenever searchTerm changes

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    return (
        <div className="page-container">
            <div className="sidebar" style={{ zIndex: 1000 }}>
                <NewsSidebar onSearch={handleSearch} />
            </div>
            <div className="content">
                <div className="title-container">
                    <NewsCompanyTitle textContent={`${searchTerm} News Feed`} />
                </div>
                <NewsHeroSection
                    title={newsArticles.hero.article_title}
                    subtitle={newsArticles.hero.article_summary}
                    imageSrc={newsArticles.hero.article_photo_url}
                />
                <hr className='blue-line'/>
                <div className="d-flex align-items-center justify-content-between me-5">
                    <h4 className='filter-title my-2'>Most Recent</h4>
                    <FilterButton />
                </div>
                <NewsList articles={newsArticles.articles} />
            </div>
        </div>
    );
}

export default NewsFeed;
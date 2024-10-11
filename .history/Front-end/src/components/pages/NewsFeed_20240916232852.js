import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NewsCompanyTitle from '../newsfeed-components/NewsCompanyTitle';
import NewsHeroSection from '../newsfeed-components/NewsHeroSection';
import NewsList from '../newsfeed-components/NewsList';
import NewsSidebar from '../newsfeed-components/NewsSidebar';
import FilterButton from '../newsfeed-components/FilterButton';
import { useMsal } from '@azure/msal-react';
import './NewsFeed.css';

function NewsFeed() {

    const [newsData, setNewsData] = useState({
        hero: { title: '', subtitle: '', image: '' },
        articles: []
    });
    const [searchTerm, setSearchTerm] = useState('CBA'); // Default company symbol
    const [email, setEmail] = useState('');

    

    useEffect(() => {
        const fetchNews = async () => {
            if (!searchTerm || !email) return;

            try {
                const response = await axios.get(`http://localhost:4000/news`, { params: { symbol: searchTerm, email: email } });
                const news = response.data.data.news || []; // Ensure news is an array

                // Check if news has data
                if (news.length > 0) {
                    const heroArticle = news[0]; // First article for hero section
                    setNewsData({
                        hero: {
                            title: heroArticle.article_title || 'No title available',
                            subtitle: heroArticle.article_summary || 'No summary available',
                            image: heroArticle.article_photo_url || ''
                        },
                        articles: news
                    });
                } else {
                    setNewsData({
                        hero: {
                            title: 'No news available now',
                            subtitle: '',
                            image: ''
                        },
                        articles: []
                    });
                }
            } catch (error) {
                console.error('Error fetching news:', error);
                setNewsData({
                    hero: {
                        title: 'No news available now',
                        subtitle: '',
                        image: ''
                    },
                    articles: []
                });
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
                    title={newsData.hero.title}
                    subtitle={newsData.hero.subtitle}
                    image={newsData.hero.image} // This may be redundant if using articles for the carousel
                    articles={newsData.articles} // Pass articles for the carousel
                />

                <hr className='blue-line' />
                <div className="d-flex align-items-center justify-content-between me-5">
                    <h4 className='filter-title my-2'>Most Recent</h4>
                    <FilterButton />
                </div>
                <NewsList articles={newsData.articles} />
            </div>
        </div>
    );
}

export default NewsFeed;
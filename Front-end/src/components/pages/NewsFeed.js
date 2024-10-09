import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import NewsCompanyTitle from '../newsfeed-components/NewsCompanyTitle';
import NewsHeroSection from '../newsfeed-components/NewsHeroSection';
import NewsList from '../newsfeed-components/NewsList';
import NewsSidebar from '../newsfeed-components/NewsSidebar';
import FilterButton from '../newsfeed-components/FilterButton';
import { useMsal } from '@azure/msal-react';
import './NewsFeed.css';
import TutorialOverlay from '../stockanalysis-components/TutorialOverlay'; 


function NewsFeed() {
    const { accounts } = useMsal();
    const [newsData, setNewsData] = useState({
        hero: { title: '', subtitle: '', image: '' },
        articles: []
    });
    const [searchTerm, setSearchTerm] = useState('CBA'); // Default company symbol
    const [email, setEmail] = useState('');

    // for tutorial
    const [tutorialActive, setTutorialActive] = useState(false);
    const [tutorialStep, setTutorialStep] = useState(1);
    const [expandedItems, setExpandedItems] = useState([]);


    // reference for accordion
    const stockRecommendationsRef = useRef(null);

    // check local storage for the show tutorial flag
    useEffect(() => {
        const showTutorial = localStorage.getItem('showTutorial');
        const storedStep = localStorage.getItem('tutorialStep');
        if (showTutorial === 'true' && storedStep) {
            // open accordions here (there's 2 of them)
            setExpandedItems(['currentInvestments', 'followedCompanies']);

            
            setTutorialActive(true);
            setTutorialStep(9);
            
            localStorage.removeItem('showTutorial');
            localStorage.removeItem('tutorialStep');
        }
    }, []);

    const handleNextTutorialStep = () => {
        if (tutorialStep < 10) { 
            setTutorialStep(tutorialStep + 1);
        } else {
            setTutorialActive(false);
        }
    };

    const handleCloseTutorial = () => {
        setTutorialActive(false);
    };

    const handleAccordionToggle = (eventKey) => {
        if (expandedItems.includes(eventKey)) {
            setExpandedItems(expandedItems.filter(key => key !== eventKey));
        } else {
            setExpandedItems([...expandedItems, eventKey]);
        }
    };

    // State for current investment companies
    const [currentInvestmentCompanies, setCurrentInvestmentCompanies] = useState([
        { id: 1, companyTitle: 'WOOLWORTHS GROUP LIMITED (WOW)' },
        { id: 2, companyTitle: 'BHP Group Ltd (BHP)' },
        { id: 3, companyTitle: 'Adairs (ADH)' },
        { id: 4, companyTitle: 'COLES GROUP LIMITED (COL)' },
        { id: 5, companyTitle: 'APPLE (APL)' },
        { id: 6, companyTitle: 'BHP Group Ltd (BHP)' },
        { id: 7, companyTitle: 'Adairs (ADH)' },
        { id: 8, companyTitle: 'COLES GROUP LIMITED (COL)' },
        { id: 9, companyTitle: 'APPLE (APL)' },
    ]);

    // State for followed companies
    const [followedCompanies, setFollowedCompanies] = useState([
        { id: 1, companyTitle: 'WOOLWORTHS GROUP LIMITED (WOW)' },
        { id: 2, companyTitle: 'BHP Group Ltd (BHP)' },
        { id: 3, companyTitle: 'Adairs (ADH)' },
        { id: 4, companyTitle: 'COLES GROUP LIMITED (COL)' },
        { id: 5, companyTitle: 'WOOLWORTHS GROUP LIMITED (WOW)' },
        { id: 6, companyTitle: 'BHP Group Ltd (BHP)' },
        { id: 7, companyTitle: 'Adairs (ADH)' },
        { id: 8, companyTitle: 'COLES GROUP LIMITED (COL)' },
    ]);

    // Fetch email from the logged-in user using MSAL
    useEffect(() => {
        if (accounts.length > 0) {
            const userEmail = accounts[0].username;  // Extract email from the account object
            setEmail(userEmail);
        }
    }, [accounts]);

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
    }, [searchTerm, email]);

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    // Add a new current investment
    const handleAddNewInvestment = () => {
        const newInvestment = {
            id: currentInvestmentCompanies.length + 1,
            companyTitle: `New Investment ${currentInvestmentCompanies.length + 1}`
        };
        setCurrentInvestmentCompanies([...currentInvestmentCompanies, newInvestment]);
    };

    // Add a new followed company
    const handleAddNewFollowing = () => {
        const newFollowing = {
            id: followedCompanies.length + 1,
            companyTitle: `New Following ${followedCompanies.length + 1}`
        };
        setFollowedCompanies([...followedCompanies, newFollowing]);
    };

    return (
        <div className="page-container">
            <div className="sidebar-container" style={{ zIndex: 1000 }}>
                {/* Passing currentInvestmentCompanies and followedCompanies to NewsSidebar */}
                <NewsSidebar 
                    onSearch={handleSearch}
                    currentInvestmentCompanies={currentInvestmentCompanies}
                    followedCompanies={followedCompanies}

                    expandedItems={expandedItems} 
                    onToggle={handleAccordionToggle} 
                    ref={stockRecommendationsRef} 
                />
            </div>
            <div className="content newsfeed-container pt-0">
                <div className="title-container">
                    <NewsCompanyTitle
                        textContent={`Commonwealth Bank of Australia (${searchTerm})`}
                        onAddNewInvestment={handleAddNewInvestment}
                        onAddNewFollowing={handleAddNewFollowing}
                    />
                </div>
                <NewsHeroSection
                    title={newsData.hero.title}
                    subtitle={newsData.hero.subtitle}
                    image={newsData.hero.image}
                    articles={newsData.articles}
                />
                <hr className='blue-line' />
                <div className="d-flex align-items-center justify-content-between me-5">
                    <h4 className='filter-title my-2'>Most Recent</h4>
                    <FilterButton />
                </div>
                <NewsList articles={newsData.articles} />
            </div>

            {tutorialActive && (
                <TutorialOverlay 
                    step={tutorialStep} 
                    onNext={handleNextTutorialStep} 
                    onClose={handleCloseTutorial} 
                />
            )}

        </div>
    );
}

export default NewsFeed;
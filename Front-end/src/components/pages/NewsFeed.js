import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import NewsCompanyTitle from '../newsfeed-components/NewsCompanyTitle';
import NewsHeroSection from '../newsfeed-components/NewsHeroSection';
import NewsList from '../newsfeed-components/NewsList';
import NewsSidebar from '../newsfeed-components/NewsSidebar';
import FilterButton from '../newsfeed-components/FilterButton';
import TutorialOverlay from '../stockanalysis-components/TutorialOverlay'; 
import { useMsal } from '@azure/msal-react';
import './NewsFeed.css';

function NewsFeed() {
    const { accounts } = useMsal();
    const [newsData, setNewsData] = useState({
        hero: { title: '', subtitle: '', image: '' },
        articles: []
    });
    const [searchTerm, setSearchTerm] = useState('CBA'); // Default company symbol
    const [email, setEmail] = useState('');
    const [followedCompanies, setFollowedCompanies] = useState([]);  // Followed companies will be fetched
    const [loadingFollowedCompanies, setLoadingFollowedCompanies] = useState(true);
    const [errorFollowedCompanies, setErrorFollowedCompanies] = useState(null);


     // for tutorial
     const [tutorialActive, setTutorialActive] = useState(false);
     const [tutorialStep, setTutorialStep] = useState(1);
     //const [expandedItems, setExpandedItems] = useState([]);
 
     const stockRecommendationsRef = useRef(null);
 
     useEffect(() => {
         const showTutorial = localStorage.getItem('showTutorial');
         const storedStep = localStorage.getItem('tutorialStep');
         if (showTutorial === 'true' && storedStep) {
             // open accordions here (there's 2 of them)
             //setExpandedItems(['currentInvestments', 'followedCompanies']);
 
             
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

    

    // Fetch email from the logged-in user using MSAL
    useEffect(() => {
        if (accounts.length > 0) {
            const userEmail = accounts[0].username;  // Extract email from the account object
            setEmail(userEmail);
        }
    }, [accounts]);

    // Fetch favorite stocks for followed companies
    useEffect(() => {
        const fetchFollowedCompanies = async () => {
            if (!email) return;

            try {
                setLoadingFollowedCompanies(true);
                const response = await axios.get('http://localhost:8080/favorite-stocks/favorites', { params: { email } });
                const favoriteStocks = response.data.favoriteStocks || [];

                const companies = favoriteStocks.map((stock, index) => ({
                    id: index + 1,
                    companyTitle: stock  // Assuming you want to display stock symbols
                }));

                setFollowedCompanies(companies);
                setLoadingFollowedCompanies(false);
            } catch (error) {
                setErrorFollowedCompanies('Failed to fetch followed companies');
                console.error(error);
                setLoadingFollowedCompanies(false);
            }
        };

        fetchFollowedCompanies();
    }, [email]);

    useEffect(() => {
        const fetchNews = async () => {
            if (!searchTerm || !email) return;

            try {
                const response = await axios.get(`http://localhost:8080/news`, { params: { symbol: searchTerm, email: email } });
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
            <div className="mt80" style={{ zIndex: 1000 }}>
                {/* Passing currentInvestmentCompanies and followedCompanies to NewsSidebar */}
                <NewsSidebar 
                    onSearch={handleSearch}
                    currentInvestmentCompanies={currentInvestmentCompanies}
                    followedCompanies={followedCompanies}
                    ref = {stockRecommendationsRef}
                    loading={loadingFollowedCompanies}
                    error={errorFollowedCompanies}
                />
            </div>
            <div className="content content-margining pt-0">
                <NewsCompanyTitle
                    textContent={`${searchTerm}`}
                    onAddNewInvestment={handleAddNewInvestment}
                    onAddNewFollowing={handleAddNewFollowing}
                />
                <NewsHeroSection
                    title={newsData.hero.title}
                    subtitle={newsData.hero.subtitle}
                    image={newsData.hero.image}
                    articles={newsData.articles}
                />
                <hr />
                <div className="d-flex align-items-center justify-content-between me-3 mb-4">
                    <h4 className='page-subtitle2-text'>Most Recent</h4>
                    <FilterButton />
                </div>
                <NewsList articles={newsData.articles}/>
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
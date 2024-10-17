import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import NewsCompanyTitle from '../newsfeed-components/NewsCompanyTitle';
import NewsHeroSection from '../newsfeed-components/NewsHeroSection';
import NewsList from '../newsfeed-components/NewsList';
import NewsSidebar from '../newsfeed-components/NewsSidebar';
import FilterButton from '../newsfeed-components/FilterButton';
import TutorialOverlay from '../stockanalysis-components/TutorialOverlay'; 
import { useMsal } from '@azure/msal-react';
import Swal from 'sweetalert2';
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
    const [currentInvestmentCompanies, setCurrentInvestmentCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


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

    // Fetch email from the logged-in user using MSAL
    useEffect(() => {
        if (accounts.length > 0) {
            const userEmail = accounts[0].username;  // Extract email from the account object
            setEmail(userEmail);
        }
    }, [accounts]);

    // Fetch the current investments from the backend
    useEffect(() => {
        const fetchCurrentInvestments = async () => {
            if (!email) return;

            try {
                const response = await axios.get('http://localhost:8080/investment/current-investments', { params: { email } });
                setCurrentInvestmentCompanies(response.data.currentInvestments);
            } catch (error) {
                setError('Failed to fetch current investments');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchCurrentInvestments();
    }, [email]);

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

    // Function to add a stock to current investments
    const handleAddNewInvestment = async () => {
        try {
            const stockSymbol = searchTerm; // Use the current search term
            const response = await axios.post('http://localhost:8080/investment/add-current-investment', {
                email,
                stock_symbol: stockSymbol,
            });

            if (response.status === 200) {
                // Add the new stock to the sidebar instantly after a successful response
                setCurrentInvestmentCompanies(prevCompanies => [
                    ...prevCompanies,
                    { companyTitle: `(${stockSymbol})` }
                ]);

                Swal.fire({
                    title: 'Success!',
                    text: 'Stock added to current investments!',
                    icon: 'success',
                    confirmButtonText: 'Cool',
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: 'Failed to add stock to current investments',
                icon: 'error',
                confirmButtonText: 'Try Again',
            });
        }
    };



    
    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    // Fetch news for a specific stock when clicked
    const handleClickSearch = async (companyTitle) => {
        const stockSymbol = companyTitle.match(/\((.*?)\)/)[1]; // Extract stock symbol from "Company Name (SYMBOL)"
        setSearchTerm(stockSymbol);

        try {
            const response = await axios.get(`http://localhost:8080/news`, { params: { symbol: stockSymbol, email } });
            const news = response.data.data.news || [];

            if (news.length > 0) {
                const heroArticle = news[0]; // First article for the hero section
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

    // // Add a new current investment
    // const handleAddNewInvestment = () => {
    //     const newInvestment = {
    //         id: currentInvestmentCompanies.length + 1,
    //         companyTitle: `New Investment ${currentInvestmentCompanies.length + 1}`
    //     };
    //     setCurrentInvestmentCompanies([...currentInvestmentCompanies, newInvestment]);
    // };

    const handleAddNewFollowing = async () => {
        try {
            const stockSymbol = searchTerm;
    
            // First, fetch the user ID based on the email
            const userResponse = await axios.get('http://localhost:8080/favorite-stocks/get-userid', { params: { email } });
            const userId = userResponse.data.userId;
    
            // Make the request to add the stock to followed companies
            const response = await axios.post('http://localhost:8080/favorite-stocks/add', {
                userId, 
                stockSymbol
            });
    
            if (response.status === 200) {
                // Show success message with a cute pop-up
                setFollowedCompanies(prevCompanies => [
                    ...prevCompanies,
                    { companyTitle: `${searchTerm}` }
                ]);
                
                Swal.fire({
                    title: 'Success!',
                    text: 'Stock added to followed companies!',
                    icon: 'success',
                    confirmButtonText: 'Cool',
                });
            } else {
                throw new Error('Failed to add stock to followed companies');
            }
        } catch (error) {
            console.error('Error adding to followed companies:', error);
            Swal.fire({
                title: 'Error',
                text: 'Failed to add stock to followed companies',
                icon: 'error',
                confirmButtonText: 'Try Again',
            });
        }
    };    
    

    return (
        <div className="page-container">
            <div className="mt80" style={{ zIndex: 1000 }}>
                {/* Passing currentInvestmentCompanies and followedCompanies to NewsSidebar */}
                <NewsSidebar 
                    onSearch={handleSearch}
                    onClick={handleClickSearch}
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
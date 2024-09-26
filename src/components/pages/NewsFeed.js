import React, { useState, useEffect, useRef } from 'react';
import NewsCompanyTitle from '../newsfeed-components/NewsCompanyTitle';
import NewsHeroSection from '../newsfeed-components/NewsHeroSection';
import NewsList from '../newsfeed-components/NewsList';
import NewsSidebar from '../newsfeed-components/NewsSidebar';
import FilterButton from '../newsfeed-components/FilterButton';
import TutorialOverlay from '../stockanalysis-components/TutorialOverlay'; 
import './NewsFeed.css';

function NewsFeed() {
    const [tutorialActive, setTutorialActive] = useState(false);
    const [tutorialStep, setTutorialStep] = useState(1);
    const [expandedItem, setExpandedItem] = useState(null); // for accordion

    // reference for accordion
    const stockRecommendationsRef = useRef(null);

    // check local storage for the show tutorial flag
    useEffect(() => {
        const showTutorial = localStorage.getItem('showTutorial');
        const storedStep = localStorage.getItem('tutorialStep');
        if (showTutorial === 'true' && storedStep) {
            setTutorialActive(true);
            setTutorialStep(parseInt(storedStep, 10));
            setExpandedItem("0"); // open the accordion
            localStorage.removeItem('showTutorial');
            localStorage.removeItem('tutorialStep');
        }
    }, []);

    const handleNextTutorialStep = () => {
        if (tutorialStep < 11) { 
            setTutorialStep(tutorialStep + 1);
        } else {
            setTutorialActive(false);
        }
    };

    const handleCloseTutorial = () => {
        setTutorialActive(false);
    };

    const handleAccordionToggle = (eventKey) => {
        setExpandedItem(expandedItem === eventKey ? null : eventKey);
    };

    return (
        <div className="page-container">
            <div className="sidebar" style={{ zIndex: 1000 }}>
                {/* Pass expandedItem, onToggle, and ref to NewsSidebar */}
                <NewsSidebar 
                    expandedItem={expandedItem} 
                    onToggle={handleAccordionToggle} 
                    ref={stockRecommendationsRef} 
                />
            </div>
            <div className="content">
                <div className="title-container">
                    <NewsCompanyTitle textContent="BGA News Feed"/>
                </div>
                <NewsHeroSection/>
                <hr className='blue-line'/>
                <div className="d-flex align-items-center justify-content-between me-5">
                    <h4 className='filter-title my-2'>Most Recent</h4>
                    <FilterButton />
                </div>
                <NewsList />
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

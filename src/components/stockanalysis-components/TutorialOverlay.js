import React, { useState, useEffect, useRef } from 'react';
import '../Components.css';

function TutorialOverlay({ step, onNext, onClose }) {
    const [elementRect, setElementRect] = useState(null);
    const [fadeOut, setFadeOut] = useState(false);

    // for responsiveness 
    function getWindowDimensions() {
        const { innerWidth: width, innerHeight: height } = window;
        return { width, height };
    }

    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

    const steps = [

        // position for text box can be right left top bottom

        {
            // Step 1
            message: "<span class='step-title'>Settings</span><br /><span class='step-description'>Click here to edit your settings.</span>",
            selector: '#settings-button', // id element of target
            shape: 'circle', // spotlight shape
            position: 'bottom', // position of textbox from spotlight
        },
        {
            // Step 2
            message: "<span class='step-title'>Notifications</span><br /><span class='step-description'>Click here to check your notifications.</span>",
            selector: '#notifications-button',
            shape: 'circle',
            position: 'bottom', 
            padding: 10
        },
        {
            // Step 3
            message: "<span class='step-title'>Stock Analysis</span><br /><span class='step-description'>Click here to gather personalized insights and receive stock recommendations.</span>",
            selector: '#stock-analysis-button', 
            shape: 'roundedRect',
            position: 'bottom',
        },
        {
            // Step 4
            message: "<span class='step-title'>Detailed Summary</span><br /><span class='step-description'>Toggle on for a detailed summary view.</span>",
            selector: '#detailed-summary-switch', 
            shape: 'roundedRect',
            position: 'bottom', 
        },
        {
            // Step 5
            message: "<span class='step-title'>Analyse Button</span><br /><span class='step-description'>Click here to analyse a stock.</span>",
            selector: '#coles-status-button',
            shape: 'roundedRect',
            position: 'bottom',
            padding: 10
        },
        {
            // Step 6
            message: "<span class='step-title'>Search Bar</span><br /><span class='step-description'>Enter a stock name to search.</span>",
            selector: '#stock-search-bar',
            shape: 'roundedRect',
            position: 'bottom', 
        },
        {
            // Step 7
            message: "<span class='step-title'>Favorites Button</span><br /><span class='step-description'>Click to add to favorites.</span>",
            selector: '#favorites-button', 
            shape: 'circle',
            position: 'bottom', 
            padding: 10
        },
        {
            // Step 8
            message: "<span class='step-title'>Query Bar</span><br /><span class='step-description'>Type a query for personalised assistance.</span>",
            selector: '#query-bar',
            shape: 'roundedRect',
            position: 'top', 
        },
        {
            // Step 9
            message: "<span class='step-title'>News Feed</span><br /><span class='step-description'>Click here to see how current news and events could impact your investments.</span>",
            selector: '#news-feed-button', 
            shape: 'roundedRect',
            position: 'bottom', 
        }, 
    ];

    const currentStep = steps[step - 1];

    useEffect(() => {
        if (!currentStep) return;

        function handleResizeOrScroll() {
            if (currentStep.selector) {
                const element = document.querySelector(currentStep.selector);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    setElementRect(rect);
                }
            }
            setWindowDimensions(getWindowDimensions());
        }

        window.addEventListener('resize', handleResizeOrScroll);
        window.addEventListener('scroll', handleResizeOrScroll);

        handleResizeOrScroll();

        return () => {
            window.removeEventListener('resize', handleResizeOrScroll);
            window.removeEventListener('scroll', handleResizeOrScroll);
        };
    }, [currentStep]);

    if (!currentStep || !elementRect) return null;

    const { message, shape, position, padding = 0 } = currentStep;

    // fixes the spotlight from being an oval
    const spotlightDiameter =
        shape === 'circle'
            ? Math.min(elementRect.width, elementRect.height)
            : elementRect.width;

    // for either circle or rounded rectangle spotlight        
    const spotlightStyle = {
        width:
            shape === 'circle'
                ? `${spotlightDiameter + padding * 2}px`
                : `${elementRect.width + padding * 2}px`,
        height:
            shape === 'circle'
                ? `${spotlightDiameter + padding * 2}px`
                : `${elementRect.height + padding * 2}px`,
        top: `${elementRect.top + window.scrollY - padding}px`,
        left: `${elementRect.left + window.scrollX - padding}px`,
        borderRadius: shape === 'circle' ? '50%' : '10px',
    };

    const boxPosition = calculateTextBoxPosition(elementRect, position, padding);

    const handleNext = () => {
        setFadeOut(true);
        setTimeout(() => {
            onNext();
            setFadeOut(false);
        }, 500); // fade out duration
    };

    const handleClose = () => {
        setFadeOut(true);
        setTimeout(() => {
            onClose();
            setFadeOut(false);
        }, 500);
    };

    return (
        <div className={`tutorial-overlay-container ${fadeOut ? 'fade-out' : ''}`}>
            <div className="dimmed-background">
                <div className="spotlight-circle" style={spotlightStyle}></div>
            </div>
            <div
                className="tutorial-box"
                style={{ top: boxPosition.top, left: boxPosition.left }}
            >
                <p dangerouslySetInnerHTML={{ __html: message }} />
                <button onClick={handleNext}>NEXT</button>
                <button onClick={handleClose}>Skip Tutorial</button>
            </div>
        </div>
    );
}

function calculateTextBoxPosition(elementRect, position, padding = 0) {
    let top = elementRect.top + window.scrollY;
    let left = elementRect.left + window.scrollX;

    switch (position) {
        case 'right':
            left += elementRect.width + padding;
            top += elementRect.height / 2;
            break;
        case 'left':
            left -= 250 + padding;
            top += elementRect.height / 2;
            break;
        case 'top':
            top -= 100 + padding + 70;
            left += elementRect.width / 2 - 763;
            break;
        case 'bottom':
            top += elementRect.height + padding + 15;
            left += elementRect.width / 2 - 120;
            break;
        default:
            top += elementRect.height + padding;
            left += elementRect.width / 2;
    }

    return { top, left };
}

export default TutorialOverlay;
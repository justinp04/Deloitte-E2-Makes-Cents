import React, { useState, useEffect, useRef } from 'react';
import '../Components.css';

function TutorialOverlay({ step, onNext, onClose }) {
    const [isExiting, setIsExiting] = useState(false);
    const [showComponent, setShowComponent] = useState(true);
    const lastStepDataRef = useRef();

    // Step configuration array
    const steps = [
        // ... (your existing steps)

        {
            // Step 1
            message: "<span class='step-title'>Settings</span><br /><span class='step-description'>Click here to edit your settings.</span>",
            spotlight: {
                x: 1692,
                y: 39,
                shape: 'circle',
                width: 40,
                height: 40,
                borderRadius: '50%',
            },
            box: {
                x: -120,
                y: 0,
            },
        },
        {
            // Step 2
            message: "<span class='step-title'>Notifications</span><br /><span class='step-description'>Click here to check your notifications.</span>",
            spotlight: {
                x: 1608,
                y: 41,
                shape: 'circle',
                width: 40,
                height: 40,
                borderRadius: '50%',
            },
            box: {
                x: -120,
                y: 0,
            },
        },
        {
            // Step 3
            message: "<span class='step-title'>Stock Analysis</span><br /><span class='step-description'>Click here to gather personalized insights and receive stock recommendations.</span>",
            spotlight: {
                x: 1374,
                y: 40,
                shape: 'roundedRect',
                width: 140,
                height: 40,
                borderRadius: '20px',
            },
            box: {
                x: -360,
                y: 0,
            },
        },
        {
            // Step 4
            message: "<span class='step-title'>Detailed Summary</span><br /><span class='step-description'>Toggle on for a detailed summary view.</span>",
            spotlight: {
                x: 1762,
                y: 185,
                shape: 'roundedRect',
                width: 110,
                height: 40,
                borderRadius: '20px',
            },
            box: {
                x: 23,
                y: 150,
            },
        },
        {
            // Step 5
            message: "<span class='step-title'>Analyse Button</span><br /><span class='step-description'>Click here to analyse a stock.</span>",
            spotlight: {
                x: 250,
                y: 288,
                shape: 'roundedRect',
                width: 90,
                height: 40,
                borderRadius: '10px',
            },
            box: {
                x: -1920+440,
                y: 250,
            },
        },
        {
            // Step 6
            message: "<span class='step-title'>Search Bar</span><br /><span class='step-description'>Enter a stock name to search.</span>",
            spotlight: {
                x: 145,
                y: 517,
                shape: 'roundedRect',
                width: 270,
                height: 50,
                borderRadius: '10px',
            },
            box: {
                x: -1920+330,
                y: 490,
            },
        },
        {
            // Step 7
            message: "<span class='step-title'>Favorites Button</span><br /><span class='step-description'>Click to add to favorites.</span>",
            spotlight: {
                x: 632,
                y: 182,
                shape: 'circle',
                width: 50,
                height: 50,
                borderRadius: '50%',
            },
            box: {
                x: -1920+900,
                y: 147,
            },
        },
        {
            // Step 8
            message: "<span class='step-title'>Query Bar</span><br /><span class='step-description'>Type query for personalise assistance.</span>",
            spotlight: {
                x: 1058,
                y: 866,
                shape: 'roundedRect',
                width: 1422,
                height: 50,
                borderRadius: '10px',
            },
            box: {
                x: -1920+654,
                y: 607,
            },
        },
        {
            // Step 9
            message: "<span class='step-title'>News Feed</span><br /><span class='step-description'>Click here to see how current news and events could impact your investments.</span>",
            spotlight: {
                x: 1516,
                y: 41,
                shape: 'roundedRect',
                width: 110,
                height: 40,
                borderRadius: '20px',
            },
            box: {
                x: -220,
                y: 0,
            },
        }, 
    ];

    const currentStepData = steps[step - 1];

    // Update lastStepDataRef with the latest step data
    useEffect(() => {
        if (currentStepData) {
            lastStepDataRef.current = currentStepData;
        }
    }, [currentStepData]);

    // Handle the end of the tutorial
    useEffect(() => {
        if (!currentStepData && !isExiting) {
            setIsExiting(true);

            // After fade-out, unmount the component or call onClose
            setTimeout(() => {
                setShowComponent(false);
                onClose(); // Optionally, you can call onClose here
            }, 500); // Duration should match the CSS transition duration
        }
    }, [currentStepData, isExiting, onClose]);

    if (!showComponent) {
        return null;
    }

    const { message, spotlight, box } = currentStepData || lastStepDataRef.current || {};

    const handleNext = () => {
        onNext(); // Proceed to the next step
    };

    return (
        <div className={`tutorial-overlay-container ${isExiting ? 'fade-out' : ''}`}>
            <div className="dimmed-background">
                {/* Spotlight Shape */}
                <div
                    className="spotlight-circle"
                    style={{
                        width: `${spotlight.width}px`,
                        height: `${spotlight.height}px`,
                        top: `${spotlight.y - spotlight.height / 2}px`,
                        left: `${spotlight.x - spotlight.width / 2}px`,
                        borderRadius: spotlight.borderRadius,
                    }}
                ></div>
            </div>

            {/* Tutorial Box */}
            <div
                className="tutorial-box"
                style={{
                    transform: `translate(${box.x}px, ${box.y}px)`,
                }}
            >
                <p dangerouslySetInnerHTML={{ __html: message }} />
                <button onClick={handleNext}>NEXT</button>
                <button onClick={onClose}>Skip Tutorial</button>
            </div>
        </div>
    );
}

export default TutorialOverlay;

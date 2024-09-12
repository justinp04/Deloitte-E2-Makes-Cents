import React, { useState } from 'react';

import '../Components.css';

function TutorialOverlay({ step, onNext, onClose }) {
    const [position, setPosition] = useState(0); // Initial position

    const handleNext = () => {
        if (step === 1) {
            setPosition(position - 120); // Move by -70 pixels on first click (to the left)
        } else if (step === 2) {
            setPosition(position - 230); // Move by -250 pixels on second click (further to the left)
        }
        onNext(); // Call the onNext to proceed to the next step
    };

    const getStepContent = (step) => {
        switch (step) {
            case 1:
                return { 
                    message: "<span class='step-title'>Settings</span><br /><span class='step-description'>Click here to edit your settings.</span>", 
                    target: '.query-input' 
                };
            case 2:
                return { 
                    message: "<span class='step-title'>Notifications</span><br /><span class='step-description'>Click here to check your notifications.</span>", 
                    target: '.query-input' 
                };

            case 3:
                return { 
                    message: "<span class='step-title'>Stock Analysis</span><br /><span class='step-description'>Click here to gather personalized insights and receive stock recommendations.</span>",  
                    target: '.query-input' 
                };    
            // Add more steps as needed
            default:
                return { message: "Tutorial finished.", target: null };
        }
    };

    const { message, target } = getStepContent(step);

    return (
        <div 
            className="tutorial-overlay" 
            style={{ transform: `translateX(${position}px)` }} // Dynamically change the position (negative for left)
        >
            <div className="tutorial-box">
                <p dangerouslySetInnerHTML={{ __html: message }} />
                <button onClick={handleNext}>NEXT</button>
                <button onClick={onClose}>Skip Tutorial</button>
            </div>
        </div>
    );
}

export default TutorialOverlay;

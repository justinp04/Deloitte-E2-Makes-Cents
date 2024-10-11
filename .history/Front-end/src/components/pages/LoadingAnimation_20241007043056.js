// LoadingAnimation.js
import React from 'react';
import './LoadingAnimation.css'; // Import your CSS styles

const LoadingAnimation = () => {
    return (
        <div className="loading-container">
            <div className="loading-circle">
                <div className="circle"></div>
                <div className="circle"></div>
                <div className="circle"></div>
            </div>
            <p>Fetching stock summary...</p>
        </div>
    );
};

export default LoadingAnimation;
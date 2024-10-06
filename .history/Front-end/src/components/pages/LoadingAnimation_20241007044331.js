import React from 'react';
import './LoadingOverlay.css';

const LoadingOverlay = () => {
    return (
        <div className="loading-overlay">
            <div className="loading-circle">
                <div className="circle"></div>
                <div className="circle"></div>
                <div className="circle"></div>
            </div>
            <p className="loading-text">Loading, please wait...</p>
        </div>
    );
};

export default LoadingOverlay;
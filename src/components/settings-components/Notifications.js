/************************************************************************************************
 * Purpose: Notifications Settings Page
 * Fix: 
 *  - Switch toggle styling and distrubution
 ************************************************************************************************/
// Notifications.js
import React, { useState } from 'react';
import ToggleSwitch from '../ToggleSwitch';

const Notifications = () => {
    const [isNewsUpdatesChecked, setIsNewsUpdatesChecked] = useState(true);
    const [isUrgentNewsUpdatesChecked, setIsUrgentNewsUpdatesChecked] = useState(true);
    const [isExploreNewsRecommendationsChecked, setIsExploreNewsRecommendationsChecked] = useState(true);

    const handleNewsUpdatesChange = () => {
        setIsNewsUpdatesChecked(!isNewsUpdatesChecked);
    };
    const handleUrgentNewsUpdatesChange = () => {
        setIsUrgentNewsUpdatesChecked(!isUrgentNewsUpdatesChecked);
    };
    const handleExploreNewsRecommendationsChange = () => {
        setIsExploreNewsRecommendationsChecked(!isExploreNewsRecommendationsChecked);
    };

    return (
        <div>
            <h2 className='fw-bold ms-3'>Notification Preferences</h2>
            <div className="form-check form-switch ms-3">
                <div className="d-flex align-items-center">
                    <ToggleSwitch
                        id="react-switch-news-updates"
                        isChecked={isNewsUpdatesChecked}
                        onChange={handleNewsUpdatesChange}
                    />
                    <span className="toggle-switch-text fw-bold ms-2">News Updates</span>
                </div>
            </div>
            <div className="form-check form-switch ms-3">
                <div className="d-flex align-items-center">
                    <ToggleSwitch
                        id="react-switch-urgent-news-updates"
                        isChecked={isUrgentNewsUpdatesChecked}
                        onChange={handleUrgentNewsUpdatesChange}
                    />
                    <span className="toggle-switch-text fw-bold ms-2">Urgent News Updates</span>
                </div>
            </div>
            <div className="form-check form-switch ms-3">
                <div className="d-flex align-items-center">
                    <ToggleSwitch
                        id="react-switch-explore-news-recommendations"
                        isChecked={isExploreNewsRecommendationsChecked}
                        onChange={handleExploreNewsRecommendationsChange}
                    />
                    <span className="toggle-switch-text fw-bold ms-2">Explore News Recommendations</span>
                </div>
            </div>
            <div className="d-flex justify-content-start ms-3 mt-3">
                <button type="button" className="green-btn me-2">Save</button>
                <button type="button" className="black-btn">Discard Changes</button>
            </div>
        </div>
    );
}

export default Notifications;

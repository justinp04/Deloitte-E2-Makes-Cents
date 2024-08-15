/************************************************************************************************
 * Purpose: Notifications Settings Page
 * Fix: 
 *  - Switch toggle styling and distrubution
 ************************************************************************************************/

import React, { useState } from 'react';

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
        <input
          className="form-check-input"
          type="checkbox"
          role="switch"
          id="flexSwitchCheckNewsUpdates"
          checked={isNewsUpdatesChecked}
          onChange={handleNewsUpdatesChange}
        />
        <label className="form-check-label" htmlFor="flexSwitchCheckNewsUpdates">
          News Updates
        </label>
      </div>
      <div className="form-check form-switch ms-3">
        <input
          className="form-check-input"
          type="checkbox"
          role="switch"
          id="flexSwitchCheckUrgentNewsUpdates"
          checked={isUrgentNewsUpdatesChecked}
          onChange={handleUrgentNewsUpdatesChange}
        />
        <label className="form-check-label" htmlFor="flexSwitchCheckUrgentNewsUpdates">
          Urgent News Updates
        </label>
      </div>
      <div className="form-check form-switch ms-3">
        <input
          className="form-check-input"
          type="checkbox"
          role="switch"
          id="flexSwitchCheckExploreNewsRecommendations"
          checked={isExploreNewsRecommendationsChecked}
          onChange={handleExploreNewsRecommendationsChange}
        />
        <label className="form-check-label" htmlFor="flexSwitchCheckExploreNewsRecommendations">
          Explore News Recommendations
        </label>
      </div>
      <div className="d-flex justify-content-start ms-3 mt-3">
        <button type="button" className="green-btn me-2">Save</button>
        <button type="button" className="black-btn">Discard Changes</button>
      </div>
    </div>
  );
}

export default Notifications;

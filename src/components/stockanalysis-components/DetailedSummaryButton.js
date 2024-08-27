// DetailedSummaryButton.js
import React, { useState } from 'react';
import ToggleSwitch from './ToggleSwitch';

const DetailedSummaryButton = () => {
  const [isDetailedSummaryChecked, setIsDetailedSummaryChecked] = useState(true);

  const handleToggleChange = () => {
    setIsDetailedSummaryChecked(!isDetailedSummaryChecked);
  };

  return (
    <div className="d-flex align-items-center">
      <ToggleSwitch
        id="react-switch-detailed-summary"
        isChecked={isDetailedSummaryChecked}
        onChange={handleToggleChange}
      />
      <span className="toggle-switch-text fw-bold ms-2">Detailed Summary</span>
    </div>
  );
}

export default DetailedSummaryButton;

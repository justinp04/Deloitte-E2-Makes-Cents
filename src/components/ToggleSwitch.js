/************************************************************************************************
 * Purpose: Defining Toggle Switch
 * Fix: 
 ************************************************************************************************/
import React from 'react';

import './Components.css';

const ToggleSwitch = () => {
  return (
    <>
      <input
        className="react-switch-checkbox"
        id={`react-switch-new`}
        type="checkbox"
      />
      <label
        className="react-switch-label"
        htmlFor={`react-switch-new`}
      >
        <span className={`react-switch-button`} />
      </label>
      <span className="toggle-switch-text fw-bold">Detailed Summary</span>
    </>
  );
}
export default ToggleSwitch;


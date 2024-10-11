/************************************************************************************************
 * Purpose: Defining Toggle Switch
 * Fix: 
 ************************************************************************************************/
import React from 'react';
import './Components.css';

const ToggleSwitch = ({ id, isChecked, onChange }) => {
  return (
    <>
      <input
        className="react-switch-checkbox"
        id={id}
        type="checkbox"
        checked={isChecked}
        onChange={onChange}
      />
      <label
        className="react-switch-label"
        htmlFor={id}
      >
        <span className="react-switch-button" />
      </label>
    </>
  );
}

export default ToggleSwitch;
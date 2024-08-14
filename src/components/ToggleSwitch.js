import React from 'react';

function ToggleSwitch({ checked, onChange, id }) {
  return (
    <div className="form-check form-switch ms-3">
      <input
        className="form-check-input"
        type="checkbox"
        role="switch"
        id={id}
        checked={checked}
        onChange={onChange}
      />
    </div>
  );
}

export default ToggleSwitch;

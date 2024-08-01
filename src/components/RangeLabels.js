import React from 'react';
import PropTypes from 'prop-types';

// Logic for the labels under sliders for range questions

const RangeLabels = ({ labels }) => {
  return (
    <div className="range-labels d-flex justify-content-between mt-3">
      {labels.map((label, index) => (
        <div key={index} className="text-center range-label-container" style={{ flex: 1 }}>
          <div className="range-number fw-bold">{index + 1}</div>
          <div className="range-label fw-bold">{label}</div>
        </div>
      ))}
    </div>
  );
}

RangeLabels.propTypes = {
  labels: PropTypes.arrayOf(PropTypes.string).isRequired,
};

RangeLabels.defaultProps = {
  labels: [],
};

export default RangeLabels;

/************************************************************************************************
 * Purpose: Logic for sliders for range questions
 * Fix: 
 ************************************************************************************************/
import React from 'react';
import './Components.css';

const RangeQuestion = ({ label, min, max, value, onChange, labels }) => {
  const numberOfSteps = max - min;

  return (
    <div className='question-box'>
      <label className='mb-1 fw-bold' style={{ marginBottom: '4px' }}>{label}</label> {/* Reduced margin-bottom */}
      <input 
        type="range" 
        min={min} 
        max={max} 
        className='slider' 
        value={value} 
        onChange={(e) => onChange(Number(e.target.value))} 
        style={{ width: '100%' }}
      />
      <div className="range-labels mx-3" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', position: 'relative' }}> {/* Reduced margin-top */}
        {labels.map((rangeLabel, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: `${(index / numberOfSteps) * 100}%`,
              transform: `translateX(-50%)`,
              textAlign: 'center',
              whiteSpace: 'nowrap',
              fontSize: '14px', // Slightly larger text size
            }}
          >
            <div style={{ color: 'black', fontWeight: 'bold' }}>{index + 1}</div>
            <div style={{ color: '#9e4cff', fontWeight: 'bold' }}>{rangeLabel}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

RangeQuestion.defaultProps = {
  labels: [],
};

export default RangeQuestion;


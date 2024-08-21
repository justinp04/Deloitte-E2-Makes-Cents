import React from 'react';
import RangeLabels from './RangeLabels'; 

// Logic for sliders for range questions

const RangeQuestion = ({ label, min, max, value, onChange, labels }) => {
  return (
    <div className='question-box'>
      <label className='mb-2 fw-bold'>{label}</label>
      <input 
        type="range" 
        min={min} 
        max={max} 
        className='slider' 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
      />
      <RangeLabels labels={labels}/>
    </div>
  );
}

RangeQuestion.defaultProps = {
  labels: [],
};

export default RangeQuestion;

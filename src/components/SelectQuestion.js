/************************************************************************************************
 * Purpose: Drop down menu logic for income selection
 * Fix: 
 ************************************************************************************************/
import React from 'react';
import CustomSelect from './CustomSelect';

const SelectQuestion = ({ label, options, value, onChange }) => {
  return (
    <div className='question-box'>
      <label className='mb-2 fw-bold'>{label}</label>
      <CustomSelect
        options={options}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

export default SelectQuestion;

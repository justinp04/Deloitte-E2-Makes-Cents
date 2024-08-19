
import React, { useState } from 'react';

import './Components.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';



const ToggleList = ({ title, items }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleList = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="toggle-list-container">
      <div 
        onClick={toggleList} 
        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
      >
        <FontAwesomeIcon icon={isOpen ? faChevronDown : faChevronRight} />
        <h6 style={{ marginLeft: '10px', fontWeight: 'bold' }}>
          {title}
        </h6>
      </div>
      {isOpen && (
        <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>  
      )}
    </div>
  );
};

export default ToggleList;

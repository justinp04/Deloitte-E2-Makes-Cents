import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import '../ToggleList.css';

const SummaryReferences = ({ title, references }) => {
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
          <div className="references" style={{ marginTop: '10px', paddingLeft: '20px' }}>
            <ol>
              {references.map((ref, index) => (
                <li key={index}>
                  <a href={ref.link} target="_blank" rel="noopener noreferrer">
                    {ref.text}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    );
};
export default SummaryReferences;
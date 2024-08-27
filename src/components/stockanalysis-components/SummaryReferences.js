import React, { useState } from 'react';
import {Button, Collapse, Card} from'react-bootstrap';

import FavoriteButton from './FavouriteButton';
import '../Components.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const SummaryReferences = ({ title, references }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleList = () => {
      setIsOpen(!isOpen);
    };
  
    return (
      <div className="toggle-list-container">
        {/* <div 
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
        )} */}
          <p className="mb-0 ms-5" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none'}}>
            <button className="btn btn-primary fw-bold mb-0" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample" style={{background: 'transparent', border: 'none', color:'black'}}>
              <FontAwesomeIcon icon={faChevronRight} className=' ms-0 me-2'/>
              BEGA CHEESE LIMITED (BGA)
            </button>
            <FavoriteButton className="ms-0"/>
          </p>
          <div className="collapse mb-0 ms-5 me-5" id="collapseExample">
            <div className="card card-body" style={{background: 'transparent', border: 'none'}}>
              As a beginner investor with a long-term investment horizon and a higher risk tolerance, investing in Bega Cheese Limited could be a suitable option. Given your neutral stance on potential losses and ability to withstand short-term declines, Bega Cheese Limited, as a well-established company in the food industry, may offer potential for higher returns over the long term. However, it's important to conduct thorough research and consider diversifying your portfolio with other stocks as well.
            </div>
          </div>
        </div>
    );
};
export default SummaryReferences;
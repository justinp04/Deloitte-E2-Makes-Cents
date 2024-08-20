/************************************************************************************************
 * Purpose: Search bar
 * Fix:
 ************************************************************************************************/
import React from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import './SearchBar.css';

const SearchBar = ({ placeholder }) => {
  return (
    <div style={{ width: '270px' }}>
      <InputGroup className="rounded-input-group mt-2">
        <Form.Control
          placeholder={placeholder}
          aria-label={placeholder}
          className="border-no-outline rounded-left"
        />
        <div className='searchbar rounded-right' style={{ width: '15%' }}>
          <FontAwesomeIcon icon={faSearch} style={{ color: 'darkgrey' }}/>
        </div>
      </InputGroup>
    </div>
  );
}

export default SearchBar;




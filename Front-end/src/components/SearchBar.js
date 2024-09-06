/************************************************************************************************
 * Purpose: Search bar
 * Fix:
 ************************************************************************************************/
import React from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import './Components.css';

const SearchBar = ({ placeholder }) => {
  return (
    <div className="mx-3 mb-2" style={{ width: '260px' }}>
      <InputGroup className="rounded-input-group mt-2" style={{ border: '1px solid grey', borderRadius: '30px' }}>
        <Form.Control
          placeholder={placeholder}
          aria-label={placeholder}
          style={{ border: 'none', borderRadius: '30px 0 0 30px' }} // No individual border, only round the left corners
        />
        <Button className="searchbar-icon" style={{ borderRadius: "0 30px 30px 0", backgroundColor: "white", border: "none" }}>
          <FontAwesomeIcon icon={faSearch} style={{ color: "grey" }} />
        </Button>
      </InputGroup>
    </div>
  );
}

export default SearchBar;




import React, { useState } from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import './Components.css';

const SearchBar = ({ placeholder, onSearch }) => {
    const [searchTerm, setSearchTerm] = useState(''); // State to hold the search term

    // Handle the search button click
    const handleSearch = () => {
        if (!searchTerm.trim()) {
            alert('Please enter a stock name to search.'); // Display an alert if no stock name is entered
            return;
        }
        onSearch(searchTerm); // Call the onSearch function with the search term (parent component will handle the actual API call)
    };

    // Handle pressing the "Enter" key to trigger the search
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch(); // Trigger search when Enter is pressed
        }
    };

    return (
        <div className="searchbar-container mx-3 mb-0">
            <InputGroup className="rounded-input-group mt-2" style={{ border: '1px solid grey', borderRadius: '30px' }}>
                <Form.Control
                    placeholder={placeholder}
                    aria-label={placeholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} // Update the search term as the user types
                    onKeyPress={handleKeyPress} // Trigger search on "Enter" key press
                    className="searchbar-input"
                    style={{ border: 'none', borderRadius: '30px 0 0 30px' }} // No individual border, only round the left corners
                />
                <Button 
                    className="searchbar-icon" 
                    style={{ borderRadius: "0 30px 30px 0", backgroundColor: "white", border: "none" }}
                    onClick={handleSearch} // Trigger search on button click
                >
                    <FontAwesomeIcon icon={faSearch} style={{ color: "grey" }} />
                </Button>
            </InputGroup>
        </div>
    );    
     
};

export default SearchBar;
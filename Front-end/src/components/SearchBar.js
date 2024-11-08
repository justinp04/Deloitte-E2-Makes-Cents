import React, { useState } from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import './Components.css';
import '../index.css';

const SearchBar = ({ id, placeholder, onSearch }) => {
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

    // Handle changes in the input field (real-time update)
    const handleInputChange = (e) => {
        const newTerm = e.target.value;
        setSearchTerm(newTerm); // Update the local state
    };

    return (
        <div className="searchbar-container mx-3 mb-0">
            <InputGroup id = {id} className="rounded-input-group" style={{ border: '1px solid grey', borderRadius: '30px' }}>
                <Form.Control
                    placeholder={placeholder}
                    aria-label={placeholder}
                    value={searchTerm}
                    onChange={handleInputChange} // Update the search term as the user types
                    onKeyPress={handleKeyPress} // Trigger search on "Enter" key press
                    className="searchbar-input"
                    style={{ border: 'none', borderRadius: '30px 0 0 30px' }} // No individual border, only round the left corners
                />
                <Button 
                    className="searchbar-icon" 
                    style={{ borderRadius: "0 30px 30px 0", backgroundColor: "white", border: "none" }}
                    onClick={handleKeyPress} // Trigger search on button click
                >
                    <FontAwesomeIcon icon={faSearch} style={{ color: "grey" }} />
                </Button>
            </InputGroup>
        </div>
    );    
     
};

export default SearchBar;
import { useState } from "react";
import { Form, InputGroup, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import './Components.css';

const SearchBarTwo = ({setResults }) => {
  const [input, setInput] = useState("");

  const fetchData = (value) => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((response) => response.json())
      .then((json) => {
        const results = json.filter((user) => {
          return (
            value &&
            user &&
            user.name &&
            user.name.toLowerCase().includes(value)
          );
        });
        setResults(results);
      });
  };

  const handleChange = (value) => {
    setInput(value);
    fetchData(value);
  };

  return (
    <div className="searchbar-container mx-3 mb-0">
        <InputGroup className="rounded-input-group" style={{ border: '1px solid grey', borderRadius: '30px' }}>
        <Form.Control
                    placeholder="Search for a stock"
                    value={input}
                    onChange={(e) => handleChange(e.target.value)}// Update the search term as the user types
                    className="searchbar-input"
                    style={{ border: 'none', borderRadius: '30px 0 0 30px' }} // No individual border, only round the left corners
                />
                <Button 
                    className="searchbar-icon" 
                    style={{ borderRadius: "0 30px 30px 0", backgroundColor: "white", border: "none" }}
                    onClick={handleChange} // Trigger search on button click
                >
                    <FontAwesomeIcon icon={faSearch} style={{ color: "grey" }} />
                </Button>
        </InputGroup>
    </div>
  );
};
export default SearchBarTwo;
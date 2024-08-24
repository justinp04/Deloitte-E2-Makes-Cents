import React, { useState, useEffect, useRef } from 'react';

// Custom select drop down bar logic

function CustomSelect({ options, value, onChange }) {

  const [selected, setSelected] = useState(value);
  const [showItems, setShowItems] = useState(false);
  // Reference to the custom select container to handle clicks outside of it
  const selectRef = useRef(null);

  // Effect to handle clicks outside the custom select to close the dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      // Check if the click was outside the custom select container
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setShowItems(false); // Close the dropdown
      }
    }

    // Add event listener to detect clicks outside
    document.addEventListener('mousedown', handleClickOutside);
    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectRef]);

  // Function to handle the selection of an option
  const handleSelect = (option) => {
    setSelected(option); // Update the selected state
    onChange(option); // Call the onChange callback with the selected option
    setShowItems(false); // Close the dropdown
  };

  return (
    <div className="custom-select" ref={selectRef}>
      {/* Display the currently selected option */}
      <div
        className={`select-selected ${showItems ? 'select-arrow-active' : ''}`}
        onClick={() => setShowItems(!showItems)} // Toggle the dropdown visibility
      >
        {selected || "Select your income range"} {/* Show placeholder if no option is selected */}
      </div>
      {/* Dropdown items container */}
      <div className={`select-items ${showItems ? '' : 'select-hide'}`}>
        {options.map((option, index) => (
          <div
            key={index} // Key for React to track the elements
            className={selected === option ? 'same-as-selected' : ''} // Highlight the selected item
            onClick={() => handleSelect(option)} // Handle item click to select the option
          >
            {option} {/* Display the option text */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CustomSelect;


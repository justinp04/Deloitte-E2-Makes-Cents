/************************************************************************************************
 * Authors: Alyssha Kwok
 * Purpose: Filter button component to filter news articles in news feed page
 ************************************************************************************************/

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';

const FilterButton = () => {
return (
    <button className="filter-button ">
        <span className="filter-text">Filter</span>
        <FontAwesomeIcon icon={faFilter} className="ms-2" />
    </button>
);
}
export default FilterButton;


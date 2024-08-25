/************************************************************************************************
 * Purpose: Sidebar for Stock Analysis(SA) Page
 * Fix:
 *  - Colour
 ************************************************************************************************/
import React from 'react';

import SearchBar from '../SearchBar';
import ToggleList from '../ToggleList';

const SASidebar = () => {
    return (
        <div className="p-3 mt-4">
          <SearchBar placeholder="Search A Stock" />
          <ToggleList 
            title="Stock Recommendations" 
            items={["Recommendation 1", "Recommendation 2", "Recommendation 3"]}
          />
          <ToggleList 
            title="Favourites" 
            items={["Favourite 1", "Favourite 2", "Favourite 3"]}
          />
          <ToggleList 
            title="Search Results" 
            items={["Result 1", "Result 2", "Result 3"]}
          />
          
        </div>
      );
}
export default SASidebar;
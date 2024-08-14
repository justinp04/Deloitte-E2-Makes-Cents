/************************************************************************************************
 * Purpose: Sidebar for News Feed Page
 * Fix:
 *  - Colour
 ************************************************************************************************/
import React from 'react';
import SearchBar from '../SearchBar';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import ToggleList from '../ToggleList';

const NewsSidebar = () => {
    return (
        <div className="p-3 mt-4">
            <SearchBar placeholder="Search A Stock" />
            <ToggleList />
            <Button 
                className='add-button'>
                <FontAwesomeIcon icon={faPlus} style={{
                    height: '2rem',
                    width: '2rem',
                }}/>
            </Button>
        </div>
      );
}
export default NewsSidebar;
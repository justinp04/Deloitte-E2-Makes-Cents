/************************************************************************************************
 * Purpose: Favourites button in the shape of a star
 * Fix: 
 ************************************************************************************************/

import React, { useState } from 'react';

import '../pages/StockAnalysis.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

function FavoriteButton() {
    const [isFavorited, setIsFavorited] = useState(false);
  
    const toggleFavorite = () => {
      setIsFavorited(!isFavorited);
    };
  
    return (
        <div>
            <button className='border-no-outline favourited'> 
                <FontAwesomeIcon icon={faStar}/>
            </button>
        </div>
    );
  }
  export default FavoriteButton;
  
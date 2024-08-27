/************************************************************************************************
 * Purpose: Favourites button in the shape of a star
 * Fix: 
 ************************************************************************************************/
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCheck } from '@fortawesome/free-solid-svg-icons';

function FavouriteButton({ companyTitle, onFavourite, onRemoveFavourite, isFavourited }) {
    const [isFav, setIsFav] = useState(isFavourited);

    // If icon is a plus and clicked, it will be added to favourites
    useEffect(() => {
        setIsFav(isFavourited);
    }, [isFavourited]);

    // condition to check if stock is favourited
    // If the icon is a check and clicked (is a favourite), it will be removed from favourites
    // Else a sidebar card will be made for them
    const toggleFavourite = () => {
        if (isFav) {
            if (onRemoveFavourite) {
                onRemoveFavourite(companyTitle);
            }
        } else {
            if (onFavourite) {
                onFavourite(companyTitle);
            }
        }
        setIsFav(!isFav);
    };

    return (
        <button 
            className='border-no-outline' 
            onClick={toggleFavourite}
            style={{ background: 'none', border: 'none', padding: 0 }}
        >
            <FontAwesomeIcon 
                icon={isFav ? faCheck : faPlus} 
                className="fw-bold" 
                style={{ color: '#9747FF', fontSize: "1.4rem" }} 
            />
        </button>
    );
}

export default FavouriteButton;

/************************************************************************************************
 * Purpose: Favourites button in the shape of a star
 * Fix: 
 ************************************************************************************************/
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCheck } from '@fortawesome/free-solid-svg-icons';

function FavouriteButton({ companyTitle, onFavourite, onRemoveFavourite, isFavourited }) {
    const [isFav, setIsFav] = useState(isFavourited);

    useEffect(() => {
        setIsFav(isFavourited);
    }, [isFavourited]);

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
            className='border-no-outline favourited' 
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

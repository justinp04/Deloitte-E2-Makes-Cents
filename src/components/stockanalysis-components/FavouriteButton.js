/************************************************************************************************
 * Purpose: Favourites button in the shape of a star
 * Fix: Added id prop and assigned it to the button element
 ************************************************************************************************/
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCheck } from '@fortawesome/free-solid-svg-icons';
import '../pages/StockAnalysis.css';

function FavouriteButton({ id, companyTitle, onFavourite, onRemoveFavourite, isFavourited }) {
    const [isFav, setIsFav] = useState(isFavourited);
    const [iconClass, setIconClass] = useState('fav-icon');

    useEffect(() => {
        setIsFav(isFavourited);
    }, [isFavourited]);

    const toggleFavourite = () => {
        setIconClass('fav-icon fav-icon-leave');

        setTimeout(() => {
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

            setIconClass('fav-icon fav-icon-enter');

            setTimeout(() => {
                setIconClass('fav-icon');
            }, 175); // Duration of transition
        }, 175);
    };

    return (
        <button 
            id={id}  
            className='border-no-outline' 
            onClick={toggleFavourite}
            style={{ background: 'none', border: 'none', padding: 0 }}
        >
            <FontAwesomeIcon 
                icon={isFav ? faCheck : faPlus} 
                className={iconClass} 
                style={{ color: '#9747FF', fontSize: "1.4rem" }} 
            />
        </button>
    );
}

export default FavouriteButton;
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCheck } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import '../pages/StockAnalysis.css';

function FavouriteButton({ companyTitle, onFavourite, onRemoveFavourite, isFavourited }) {
    const [isFavouritedState, setIsFavouritedState] = useState(isFavourited);
    const [iconClass, setIconClass] = useState('fav-icon');

    // Sync component state with prop
    useEffect(() => {
        setIsFavouritedState(isFavourited);
    }, [isFavourited]);

    // Function to handle favorite toggle logic with confirmation for removal
    const toggleFavourite = () => {
        setIconClass('fav-icon fav-icon-leave');

        setTimeout(() => {
            if (isFavouritedState) {
                // Ask for confirmation to remove the favorite
                Swal.fire({
                    title: 'Are you sure?',
                    text: `Do you want to remove "${companyTitle}" from your favourites?`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, remove it!',
                    cancelButtonText: 'No, keep it'
                }).then((result) => {
                    if (result.isConfirmed) {
                        if (onRemoveFavourite) {
                            onRemoveFavourite(companyTitle); // Call the removal function
                        }
                        setIsFavouritedState(false); // Update state to unfavourited
                    }
                });
            } else {
                if (onFavourite) {
                    onFavourite(companyTitle); // Add to favorites
                    // Show alert for duplicate message if needed
                    Swal.fire({
                        icon: 'success',
                        title: 'Added!',
                        text: `"${companyTitle}" has been added to your favourites.`,
                        timer: 1500,
                        showConfirmButton: false
                    });
                }
                setIsFavouritedState(true); // Update state to favourited
            }

            // Reset icon transition class
            setIconClass('fav-icon fav-icon-enter');
            setTimeout(() => {
                setIconClass('fav-icon'); // Final state after transition
            }, 175);
        }, 175);
    };

    return (
        <button 
            className='border-no-outline' 
            onClick={toggleFavourite}
            style={{ background: 'none', border: 'none', padding: 0, height:"26px" }}
        >
            <FontAwesomeIcon 
                icon={isFavouritedState ? faCheck : faPlus} 
                className={iconClass} 
                style={{ color: '#9747FF', fontSize: "1.4rem", paddingBottom:"4px"}} 
            />
        </button>
    );
}

export default FavouriteButton;
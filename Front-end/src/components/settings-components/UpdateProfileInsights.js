/************************************************************************************************
 * Purpose: Update Profile Settings Page
 * Fix: 
 ************************************************************************************************/

import React from 'react';

import ProfileInsightsForm from '../ProfileInsightsForm';

const UpdateProfileInsights = () => {
    return (
        <div className="d-flex justify-content-center align-items-center mt-4 ms-3 ">
            <ProfileInsightsForm isUpdating={true}/>
        </div>
    );
}

export default UpdateProfileInsights;
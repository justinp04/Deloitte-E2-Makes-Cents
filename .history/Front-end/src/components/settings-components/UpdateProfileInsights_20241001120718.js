/************************************************************************************************
 * Purpose: Update Profile Settings Page
 * Fix: 
 ************************************************************************************************/

import React from 'react';

import ProfileInsightsForm from '../ProfileInsightsForm';

const UpdateProfileInsights = () => {
    return (
        <div>
            <h2 className='fw-bold ms-3'>Update Profile Insights</h2>
            <p className='ms-3'>To provide you with the most relevant stock recommendations, please fill out the 'Profile Insights' section.
                This information will help us tailor our suggestions to match your investment experience, financial goals, and risk tolerance.</p>

            <div className="d-flex justify-content-center align-items-center mt-4 ms-3 ">
                <ProfileInsightsForm isUpdating={true}/>
            </div>
        </div>
    );
}

export default UpdateProfileInsights;